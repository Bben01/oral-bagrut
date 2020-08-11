import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
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

  getValidStatus(id: string) {
    if (this.enterForm.get(id).touched) {
      return (this.enterForm.get(id).valid) ? "is-valid" : "is-invalid";
    }
    return "";
  }

  getFormValidationErrors(id: string) {
    const controlErrors: ValidationErrors = this.enterForm.get(id).errors;
    if (!controlErrors) {
      return "";
    }
    if (controlErrors['required']) {
      return "This field is required"
    }
    if (controlErrors['pattern']) {
      return id == "pin" ? "PIN must be 6 numbers" : "The password must contain at least 6 characters";
    }
  }

}
