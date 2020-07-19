import { RoomService } from './room.service';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
  students: string[] = [];
  roomNumber: string;
  studentsSubject = new Subject<string[]>();
  roomSubscription: Subscription;

  constructor(private room: RoomService) {
    this.emitStudents();
    this.roomSubscription = room.roomSubject.subscribe(roomNumber => {
      this.roomNumber = roomNumber;
    });
    this.room.emitRoom();
  }
  
  emitStudents() {
    this.studentsSubject.next(this.students);
  }

  add(name: string) {
    this.room.addRoomStudent(name);
    this.students.push(name);
    this.emitStudents();
  }
}
