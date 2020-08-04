import { Router } from '@angular/router';
import { RoomService } from './../services/room.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-break',
  templateUrl: './break.component.html',
  styleUrls: ['./break.component.scss']
})
export class BreakComponent implements OnInit, OnDestroy {
  seconds: number;
  counterSubscription: Subscription;
  
  constructor(private room: RoomService, private router: Router) { }

  ngOnInit(): void {
    let counter = interval(1000);
    this.counterSubscription = counter.subscribe(value => this.seconds = value);
  }

  ngOnDestroy(): void {
    this.counterSubscription.unsubscribe();
  }

  end() {
    console.log("Ending break");
    this.room.endBreak();
    this.router.navigate(["/teacher/recieve"]);
  }
}
