import { RoomService } from './../services/room.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import * as firebase from 'firebase/app';

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
      if (firebase.auth().currentUser == null) {
        this.errorMessage = "You have to log in before creating a session."
      }
    });
  }

  getValidStatus(id: string) {
    if (this.createForm.get(id).touched) {
      return (this.createForm.get(id).valid) ? "is-valid" : "is-invalid";
    }
    return "";
  }

  getFormValidationErrors(id: string) {
    const controlErrors: ValidationErrors = this.createForm.get(id).errors;
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
