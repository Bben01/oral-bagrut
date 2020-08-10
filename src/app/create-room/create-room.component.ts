import { RoomService } from './../services/room.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {
  createForm: FormGroup;
  errorMessage: string;
  creating: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.createForm = this.formBuilder.group({
      pin: ['', [Validators.required, Validators.pattern(/^\d{6,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  createRoom() {
    this.creating = true;
    const pin = this.createForm.get('pin').value;
    const password = this.createForm.get('password').value;
    this.roomService.createRoom(pin, password).then(message => {
      this.creating = false;
      this.router.navigate(['admin', 'dashboard']);
    }).catch(error => {
      this.creating = false;
      this.errorMessage = error.message;
    });
  }

}
