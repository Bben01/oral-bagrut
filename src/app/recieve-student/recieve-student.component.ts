import { Router, ActivatedRoute } from '@angular/router';
import { RoomService } from './../services/room.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recieve-student',
  templateUrl: './recieve-student.component.html',
  styleUrls: ['./recieve-student.component.scss']
})
export class RecieveStudentComponent implements OnInit {
  error: string;

  constructor(private room: RoomService,
    private router: Router) { }

  ngOnInit(): void {

  }

  next() {
    this.room.getStudent().then(info => {
      this.router.navigate(["/teacher/test"], { state: { info: info } });
    }).catch(reason => {
      this.error = reason;
    })
  }
}
