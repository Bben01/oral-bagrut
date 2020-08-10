import { AuthGuardService } from './services/auth-guard.service';
import { RoomGuardService } from './services/room-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';  

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { EnterRoomComponent } from './enter-room/enter-room.component';
import { RoomInfoComponent } from './room-info/room-info.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { RecieveStudentComponent } from './recieve-student/recieve-student.component';
import { BreakComponent } from './break/break.component';
import { TestStudentComponent } from './test-student/test-student.component';
import { StudentTableComponent } from './student-table/student-table.component';
import { RoomAdminComponent } from './room-admin/room-admin.component';
import { HeaderComponent } from './header/header.component';
import { SigninComponent } from './signin/signin.component';
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    CreateRoomComponent,
    EnterRoomComponent,
    RoomInfoComponent,
    AddStudentComponent,
    RecieveStudentComponent,
    BreakComponent,
    TestStudentComponent,
    StudentTableComponent,
    RoomAdminComponent,
    HeaderComponent,
    SigninComponent,
    SignupComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [AuthService, RoomService, RoomGuardService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
