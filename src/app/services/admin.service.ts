import { RoomService } from './room.service';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
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
}
