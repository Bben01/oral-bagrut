import { RoomService } from './room.service';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  students: string[] = [];
  studentsTaken: { Class: string, Name: string }[] = [];
  roomNumber: string;
  studentsSubject = new Subject<string[]>();
  studentsTakenSubject = new Subject<{ Class: string, Name: string }[]>();
  roomSubscription: Subscription;
  dataSubcription: Subscription

  constructor(private room: RoomService) {
    this.roomSubscription = room.roomSubject.subscribe(roomNumber => {
      this.roomNumber = roomNumber;
    });
    this.dataSubcription = room.dataSubject.subscribe(roomData => {
      this.students = roomData?.StudentsReady;
      this.studentsTaken = roomData?.StudentsTaken;
      this.emitStudents();
      this.emitTaken();
    });
    this.room.emitRoom();
    this.room.emitData();
  }
  
  emitStudents() {
    this.studentsSubject.next(this.students);
  }

  emitTaken() {
    this.studentsTakenSubject.next(this.studentsTaken);
  }

  add(name: string) {
    this.room.addRoomStudent(name);
    this.students.push(name);
    this.emitStudents();
    this.room.emitData();
  }

  remove(name: string) {
    this.room.removeStudent(name);
    this.room.emitData();
  }

  removeTaken() {
    this.room.removeTaken();
  }

  synchonise() {
    this.room.refresh(this.students);
  }
}
