import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  room: string;
  roomSubject = new Subject<string>();
  roomData: firebase.firestore.DocumentData;
  dataSubject = new Subject<firebase.firestore.DocumentData>();

  constructor() {
    this.emitRoom();
  }

  enterRoom(room: string, password: string) {
    const db = firebase.firestore();
    const roomNumber = room + "#" + crypto.SHA256(password);
    db.collection('rooms').doc(roomNumber).get().then(data => {
      if (data.exists) {
        this.room = roomNumber;
        this.emitRoom();
        console.log("Successfully entered the room", room);
        return { succeed: true };
      }
      else {
        console.log('The room is not accessible');
        return { error: 'The room is not accessible' };
      }
    });
  }

  saveInfos(name: string, classroom: string, isExaminer: boolean) {
    const db = firebase.firestore();
    if (isExaminer) {
      db.collection('rooms/' + this.room + '/Examiner').doc(name).set({
        Classroom: classroom,
        Student: {},
        isResting: false
      }, { merge: true }).then(_ => {
        db.collection('rooms/' + this.room + '/Examiner').doc(name).onSnapshot(doc => {
          this.roomData = doc.data();
          this.roomData["class"] = classroom;
          console.log("Room data =", this.roomData);
          this.emitData();
        });
        return true;
      }).catch(error => {
        return error;
      });
    }
    else {
      db.collection('rooms/' + this.room + '/Classroom').doc(classroom).set({
        StudentsReady: firebase.firestore.FieldValue.arrayRemove(""),
        StudentsTaken: firebase.firestore.FieldValue.arrayRemove(""),
        currentTeacher: name
      }, { merge: true }).then(_ => {
        db.collection('rooms/' + this.room + '/Classroom').doc(classroom).onSnapshot(doc => {
          this.roomData = doc.data();
          this.roomData["class"] = classroom;
          console.log("Room data =", this.roomData);
          this.emitData();
        });
        return true;
      }).catch(error => {
        return error;
      });
    }
  }
  
  emitRoom() {
    this.roomSubject.next(this.room);
  }

  emitData() {
    this.dataSubject.next(this.roomData);
  }

  createRoom(room: string, password: string) {
    // TODO: don't print, just returns
    const db = firebase.firestore();
    const roomNumber = room + "#" + crypto.SHA256(password);
    db.collection('rooms').doc(roomNumber).get().then(data => {
      if (data.exists) {
        return new Promise(_ => {
          console.log({ error: "This room already exists!" });
        });
      }
      else {
        db.collection('rooms').doc(roomNumber).set({
          StudentsReady: []
        });
        this.room = roomNumber;
        return new Promise(_ => {
          console.log({ message: "Room created successfully" });
        });
      }
    });
  }

  addRoomStudent(studentName: string) {
    const db = firebase.firestore();
    this.batchStudents(studentName);
    db.collection('rooms/' + this.room + '/Classroom').doc(this.roomData['class']).update({
      StudentsReady: firebase.firestore.FieldValue.arrayUnion(studentName)
    });
  }

  removeStudent(studentName: string) {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Classroom').doc(this.roomData['class']).update({
      StudentsReady: firebase.firestore.FieldValue.arrayRemove(studentName)
    });
    
    this.batchStudents(studentName, true);
  }

  

  batchStudents(name: string, remove: boolean = false) {
    const db = firebase.firestore();
    db.collection('rooms').doc(this.room).get().then(data => {
      let batch = db.batch();
      let dataSnap = data.data();
      let length = dataSnap.Classes[this.roomData['class']];
      length = length ? length : 0;
      batch.update(db.collection('rooms').doc(this.room), remove ? 
        { StudentsReady: firebase.firestore.FieldValue.arrayRemove({ class: this.roomData['class'], index: length - 1 }) } : 
        { StudentsReady: firebase.firestore.FieldValue.arrayUnion({ class: this.roomData["class"], index: length }) });
      dataSnap.Classes[this.roomData['class']] = length + (remove ? -1 : 1);
      batch.set(db.collection('rooms').doc(this.room), {Classes: dataSnap.Classes}, { merge: true });
      batch.commit();
    });
  }
}
