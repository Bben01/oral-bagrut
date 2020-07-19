import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
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
    RoomAdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
