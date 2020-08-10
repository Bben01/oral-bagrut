import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../services/room.service';

@Component({
  selector: 'app-enter-room',
  templateUrl: './enter-room.component.html',
  styleUrls: ['./enter-room.component.scss']
})
export class EnterRoomComponent implements OnInit {

  enterForm: FormGroup;
  errorMessage: string = "";
  entering: boolean = false;
  supervisor: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private roomService: RoomService) { }

  ngOnInit(): void {
    this.enterForm = this.formBuilder.group({
      pin: ['', [Validators.required, Validators.pattern(/^\d{6,}$/)]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    })
  }

  enterRoom() {
    const pin = this.enterForm.get('pin').value;
    const password = this.enterForm.get('password').value;
    this.entering = true;
    this.roomService.enterRoom(pin, password).then(success => {
      if (this.supervisor) {
        this.router.navigate(['student', 'info']);
      }
      else {
        this.router.navigate(['teacher', 'info']);
      }
    }).catch(error => {
      this.errorMessage = error;
    });
  }

}
