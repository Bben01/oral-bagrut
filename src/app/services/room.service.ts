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
  roomData: firebase.firestore.DocumentData = {};
  dataSubject = new Subject<firebase.firestore.DocumentData>();

  // Students Listener
  studentListener: () => void;
  studentReady: { name: string, classe: string };
  studentReadySubject = new Subject<{ name: string, classe: string }>();

  constructor() {
    this.emitRoom();
  }

  enterRoom(room: string, password: string, roomNumber: string = null) {
    const db = firebase.firestore();
    roomNumber = roomNumber ? roomNumber : room + "#" + crypto.SHA256(password);
    return new Promise((resolve, reject) => {
      db.collection('rooms').doc(roomNumber).get().then(data => {
        if (data.exists) {
          this.room = roomNumber;
          this.emitRoom();
          console.log("Successfully entered the room", room);
          resolve(true);
        }
        else {
          console.log('The room is not accessible');
          reject('The room is not accessible');
        }
      });
    });
  }

  saveInfos(name: string, classroom: string, isExaminer: boolean) {
    const db = firebase.firestore();
    if (isExaminer) {
      db.collection('rooms/' + this.room + '/Examiner').doc(classroom).set({
        Name: name,
        Student: {}
      }, { merge: true }).then(_ => {
        db.collection('rooms/' + this.room + '/Examiner').doc(classroom).onSnapshot(doc => {
          this.roomData = doc.data();
          this.roomData["class"] = classroom;
          this.roomData["name"] = name;
          this.emitData();
        });
      }).catch(error => {
        console.log(error.message);
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
          this.roomData.class = classroom;
          this.emitData();
        });
      }).catch(error => {
        console.log(error.message);
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
    const db = firebase.firestore();
    const roomNumber = room + "#" + crypto.SHA256(password);
    return new Promise((resolve, reject) => {
      db.collection('rooms').doc(roomNumber).get().then(data => {
        if (data.exists) {
          reject({ message: "This room already exists!" });
          return;
        }
        else {
          db.collection('rooms').doc(roomNumber).set({
            Classes: {},
            StudentsReady: []
          }).then(_ => {
            db.collection('rooms/' + roomNumber + '/Owner').doc('Owner').set({
              uid: firebase.auth().currentUser.uid
            }).then(_ => {
              console.log("Ownership taken!");
            }).catch(error => {
              console.log("Error with ownership ", error.message);
            });
            this.room = roomNumber;
            resolve("Room created successfully");
            return;
          }).catch(error => {
            reject(error);
            return;
          });
        }
      });
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

    if (!examinerClasse) {
      this.batchStudents(true, studentClass);
    }
  }

  removeTaken() {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Classroom').doc(this.roomData['class']).update({
      StudentsTaken: firebase.firestore.FieldValue.arrayRemove(this.roomData?.StudentsTaken[0])
    });
  }

  batchStudents(remove: boolean = false, classe: string = this.roomData['class']) {
    const db = firebase.firestore();
    db.collection('rooms').doc(this.room).get().then(data => {
      let batch = db.batch();
      let dataSnap = data.data();
      let length = dataSnap.Classes[classe];
      length = length ? length : { start: 0, stop: 0 };
      batch.update(db.collection('rooms').doc(this.room), remove ?
        { StudentsReady: firebase.firestore.FieldValue.arrayRemove({ class: classe, index: length.stop }) } :
        { StudentsReady: firebase.firestore.FieldValue.arrayUnion({ class: classe, index: length.stop + 1 }) });
      dataSnap.Classes[classe] = { start: length.start, stop: length.stop + (remove ? -1 : 1) };
      batch.set(db.collection('rooms').doc(this.room), { Classes: dataSnap.Classes }, { merge: true });
      batch.commit();
    });
  }

  getStudent() {
    const db = firebase.firestore();
    let name: string;
    let classe: string;

    const roomRef = db.collection('rooms').doc(this.room);
    return new Promise((resolve, reject) => {
      db.runTransaction(async (transaction: firebase.firestore.Transaction) => {
        const data = await transaction.get(roomRef);
        let studentsReady = data.data().StudentsReady;
        let student = studentsReady?.shift();
        if (!!student) {
          classe = student["class"];
          const startStop = data.data().Classes;
          startStop[classe]["start"] += 1;
          transaction.update(roomRef, {
            StudentsReady: studentsReady,
            Classes: startStop
          });
        }
        else {
          throw new Error("Failing transaction");
        }
      }).then(_ => {
        // Get the student
        db.collection('rooms/' + this.room + '/Classroom').doc(classe).get().then(dataStudentsClass => {
          name = dataStudentsClass.data()["StudentsReady"].length > 0 ? dataStudentsClass.data()["StudentsReady"][0] : undefined;
          if (name) {
            this.removeStudent(name, classe, this.roomData['class']);
            db.collection('rooms/' + this.room + '/Examiner').doc(this.roomData["class"]).update({
              Student: { Class: classe, Name: name }
            });
            resolve({ name: name, classe: classe });
          }
          else {
            this.setStudentListener();
            reject("Unable to find a student.");
          }
        });
      }).catch(error => {
        // Set a listener on the student queue
        console.log(error.message);
        this.setStudentListener();
        reject("No students ready at the moment, a student will be sent as soon as there is one available.");
      });
    });
  }

  setStudentListener() {
    const db = firebase.firestore();
    this.studentListener = db.collection('rooms').doc(this.room).onSnapshot(data => {
      if (data.data().StudentsReady?.length > 0) {
        this.studentListener();
        this.getStudent();
      }
    });
  }

  endTest() {
    const db = firebase.firestore();
    db.collection('rooms/' + this.room + '/Examiner').doc(this.roomData["class"]).update({
      Student: {}
    });
  }
}
