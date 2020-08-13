import { RoomService } from './../services/room.service';
import { Router, CanActivate, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-info',
  templateUrl: './room-info.component.html',
  styleUrls: ['./room-info.component.scss']
})
export class RoomInfoComponent implements OnInit {

  infoForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private roomService: RoomService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.infoForm = this.formBuilder.group({
      room: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  fillInfo() {
    const room = this.infoForm.get('room').value;
    const name = this.infoForm.get('name').value;
    
    const examiner = !!document.URL.match(/teacher/);
    this.roomService.saveInfos(name, room, examiner);

    this.router.navigate([examiner ? "../recieve" : "../add"], { relativeTo: this.activatedRoute });
  }

}
