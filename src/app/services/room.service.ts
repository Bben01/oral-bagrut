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
          this.roomData["name"] = name;
          console.log("Room data =", this.roomData);
          this.emitData();
        });
      }).catch(_ => {

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
      }).catch(_ => {

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
        console.log({ error: "This room already exists!" });
      }
      else {
        db.collection('rooms').doc(roomNumber).set({
          StudentsReady: []
        });
        this.room = roomNumber;
        console.log({ message: "Room created successfully" });
      }
    });
  }

  addRoomStudent(studentName: string) {
    const db = firebase.firestore();
    this.batchStudents();
    db.collection('rooms/' + this.room + '/Classroom').doc(this.roomData['class']).update({
      StudentsReady: firebase.firestore.FieldValue.arrayUnion(studentName)
    });
  }

  removeStudent(studentName: string, studentClass: string = this.roomData['class'], examinerClasse: string = undefined) {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Classroom').doc(studentClass).update({
      StudentsReady: firebase.firestore.FieldValue.arrayRemove(studentName),
      StudentsTaken: examinerClasse ? firebase.firestore.FieldValue.arrayUnion({ Name: studentName, Class: examinerClasse }) : firebase.firestore.FieldValue.arrayRemove("")
    });

    this.batchStudents(true, studentClass, !!examinerClasse);
  }

  removeTaken() {
    const db = firebase.firestore();
    console.log("Removing", this.roomData?.StudentsTaken[0]);
    db.collection('rooms/' + this.room + '/Classroom').doc(this.roomData['class']).update({
      StudentsTaken: firebase.firestore.FieldValue.arrayRemove(this.roomData?.StudentsTaken[0])
    });
  }

  batchStudents(remove: boolean = false, classe: string = this.roomData['class'], take: boolean = false) {
    const db = firebase.firestore();
    db.collection('rooms').doc(this.room).get().then(data => {
      let batch = db.batch();
      let dataSnap = data.data();
      let length = dataSnap.Classes[classe];
      length = length ? length : { start: 0, stop: 0 };
      batch.update(db.collection('rooms').doc(this.room), remove ?
        { StudentsReady: firebase.firestore.FieldValue.arrayRemove({ class: classe, index: take ? length.start : length.stop }) } :
        { StudentsReady: firebase.firestore.FieldValue.arrayUnion({ class: classe, index: length.stop + 1 }) });
      dataSnap.Classes[classe] = {start: take ? length.start + 1 : length.start, stop: length.stop + (remove ? -1 : 1) + (take ? 1 : 0)} ;
      batch.set(db.collection('rooms').doc(this.room), { Classes: dataSnap.Classes }, { merge: true });
      batch.commit();
    });
  }

  getStudent() {
    const db = firebase.firestore();
    let name: string;
    let classe: string;
    return new Promise((resolve, reject) => {
      db.collection('rooms').doc(this.room).get().then(data => {
        let dataStudents = data.data();
        let student = dataStudents.StudentsReady[0];
        if (!!student) {
          classe = student["class"];
          db.collection('rooms/' + this.room + '/Classroom').doc(classe).get().then(dataStudentsClass => {
            let nameData = dataStudentsClass.data();
            name = nameData["StudentsReady"].length > 0 ? nameData["StudentsReady"][0] : undefined;
            if (name) {
              this.removeStudent(name, classe, this.roomData['class']);
              db.collection('rooms/' + this.room + '/Examiner').doc(this.roomData["name"]).update({
                Student: { Class: classe, Name: name }
              });
              resolve({ name: name, classe: classe });
              return;
            }
            else {
              // TODO: watch for next student (in case there is no one available now)
              reject("Unable to find a ready student.");
              return;
            }
          })
        }
      })
    });
  }
  
  break(resting: boolean = true) {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Examiner').doc(this.roomData["name"]).update({
      isResting: resting
    });
  }

  endTest() {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Examiner').doc(this.roomData["name"]).update({
      Student: {}
    });
  }

  endBreak() {
    this.break(false);
  }
}
