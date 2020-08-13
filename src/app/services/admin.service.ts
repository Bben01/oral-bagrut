import { CanActivate } from '@angular/router';
import { RoomService } from './room.service';
import { Subject, Subscription, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate {
  room: string;
  classrooms: { class: string, studentsWaiting: number, studentsFinished: number }[];
  classroomsSubject = new Subject<{ class: string, studentsWaiting: number, studentsFinished: number }[]>();
  roomSubscription: Subscription;

  constructor(private roomService: RoomService) {
    this.roomSubscription = roomService.roomSubject.subscribe(roomNumber => {
      this.room = roomNumber;
      if (!this.classrooms) {
        const db = firebase.firestore();
        db.collection('rooms').doc(this.room).onSnapshot(data => {
          this.classrooms = [];
          let dataClassrooms = data.data();
          if (dataClassrooms?.Classes && Object.keys(dataClassrooms.Classes).length > 0) {
            for (const classroom of Object.keys(dataClassrooms.Classes)) {
              // This for is only to get the class name
              console.log(classroom);
              let info = dataClassrooms.Classes[classroom];
              this.classrooms.push({ class: classroom, studentsWaiting: info.stop - info.start, studentsFinished: info.start });
            }
            this.emitClassrooms();
          }
        });
      }
    });
    roomService.emitRoom();
  }

  emitClassrooms() {
    this.classroomsSubject.next(this.classrooms);
  }

  deleteRoom() {
    const db = firebase.firestore();
    return new Promise(resolve => {
      db.collection('rooms').doc(this.room).delete().then(_ => {
        resolve({ succes: true, message: "The room was succesfully deleted." });
      }).catch(error => {
        console.log(error);
        resolve({ succes: false, message: error.message });
      });
    });
  }

  createShareUrl() {
    return "https://www.oral-bagrut.web.app/join/" + this.room;
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const db = firebase.firestore();
    return new Promise(resolve => {
      if (!this.room) {
        resolve(false);
        return;
      }
      db.collection('rooms/' + this.room + "/Owner").doc("Owner").onSnapshot(data => {
        resolve(data.data().uid == firebase.auth().currentUser.uid);
      }, error => {
        console.log(error.message);
        resolve(false);
      });
    });
  }
}
