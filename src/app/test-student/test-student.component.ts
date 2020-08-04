import { RoomService } from './../services/room.service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-test-student',
  templateUrl: './test-student.component.html',
  styleUrls: ['./test-student.component.scss']
})
export class TestStudentComponent implements OnInit, OnDestroy {
  infos: {name: string, classe: string};
  seconds: number;
  counterSubscription: Subscription;
  constructor(private router: Router, private room: RoomService) {
    this.infos = this.router.getCurrentNavigation().extras.state.info;
    console.log(this.infos);
   }

  ngOnInit(): void {
    let counter = interval(1000);
    this.counterSubscription = counter.subscribe(value => this.seconds = value);
  }

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe();
  }

  end() {
    this.room.endTest();
    this.router.navigate(["/teacher/recieve"]);
  }
}
