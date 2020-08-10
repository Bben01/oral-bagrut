import { AuthGuardService } from './services/auth-guard.service';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { RoomAdminComponent } from './room-admin/room-admin.component';
import { MainComponent } from './main/main.component';
import { RoomGuardService } from './services/room-guard.service';
import { TestStudentComponent } from './test-student/test-student.component';
import { RecieveStudentComponent } from './recieve-student/recieve-student.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { EnterRoomComponent } from './enter-room/enter-room.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRoomComponent } from './create-room/create-room.component';
import { RoomInfoComponent } from './room-info/room-info.component';
import { BreakComponent } from './break/break.component';


const routes: Routes = [
  { path: 'create', component: CreateRoomComponent },
  { path: 'join', component: EnterRoomComponent },
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin/dashboard', canActivate: [RoomGuardService, AuthGuardService], component: RoomAdminComponent },
  { path: 'student/info', canActivate: [RoomGuardService], component: RoomInfoComponent },
  { path: 'student/add', canActivate: [RoomGuardService], component: AddStudentComponent },
  { path: 'teacher/info', canActivate: [RoomGuardService], component: RoomInfoComponent },
  { path: 'teacher/recieve', canActivate: [RoomGuardService], component: RecieveStudentComponent },
  { path: 'teacher/break', canActivate: [RoomGuardService], component: BreakComponent },
  { path: 'teacher/test', canActivate: [RoomGuardService], component: TestStudentComponent },
  { path: '', component: MainComponent, pathMatch: 'full'},
  { path: '**', component: MainComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
