import { AdminService } from './../services/admin.service';
import { Component, OnInit, OnDestroy, Directive } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './room-admin.component.html',
  styleUrls: ['./room-admin.component.scss']
})
export class RoomAdminComponent implements OnInit, OnDestroy {

  classrooms: { class: string, studentsWaiting: number, studentsFinished: number }[];
  classSubscription: Subscription;

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.classSubscription = this.adminService.classroomsSubject.subscribe(
      (classrooms: { class: string, studentsWaiting: number, studentsFinished: number }[]) => {
        this.classrooms = classrooms;
      }
    );
    this.adminService.emitClassrooms();
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
  }
}
