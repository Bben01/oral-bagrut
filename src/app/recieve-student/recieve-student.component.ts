import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RoomService } from './../services/room.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-recieve-student',
  templateUrl: './recieve-student.component.html',
  styleUrls: ['./recieve-student.component.scss']
})
export class RecieveStudentComponent implements OnInit, OnDestroy {
  error: string;

  roomData: firebase.firestore.DocumentData;
  roomDataSubscription: Subscription;

  constructor(private room: RoomService,
    private router: Router) { }

  ngOnInit(): void {
    this.roomDataSubscription = this.room.dataSubject.subscribe(data => {
      if (data.Student?.Class) {
        const student = { name: data.Student.Name, classe: data.Student.Class };
        this.router.navigate(["/teacher/test"], { state: { info: student } });
      }
    });
  }

  next() {
    this.room.getStudent().then(info => {
      this.router.navigate(["/teacher/test"], { state: { info: info } });
    }).catch(reason => {
      this.error = reason;
    })
  }

  ngOnDestroy(): void {
    this.roomDataSubscription.unsubscribe();
  }
}
