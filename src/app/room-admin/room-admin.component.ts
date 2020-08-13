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
  status: {succes: boolean, message: string};

  constructor(private router: Router, private adminService: AdminService) { }

  ngOnInit(): void {
    this.classSubscription = this.adminService.classroomsSubject.subscribe(
      (classrooms: { class: string, studentsWaiting: number, studentsFinished: number }[]) => {
        this.classrooms = classrooms;
      }
    );
    this.adminService.emitClassrooms();
  }

  deleteRoom() {
    this.adminService.deleteRoom().then((status: { succes: boolean, message: string }) => {
      this.status = status;
    });
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
  }

  getShareUrl() {
    return this.adminService.createShareUrl();
  }
}
