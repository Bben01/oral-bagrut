import { StudentsService } from './../services/students.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit, OnDestroy {
  students: string[];
  studentsSubscription: Subscription;
  studentsTakenSubscription: Subscription;

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsSubscription = this.studentsService.studentsSubject.subscribe(studentList => {
      this.students = studentList;
    });
    this.studentsTakenSubscription = this.studentsService.studentsTakenSubject.subscribe(studentsTaken => {
      if (studentsTaken?.length > 0) {
        document.getElementById("body").innerHTML = "You can send " + studentsTaken[0]["Name"] + " to " + studentsTaken[0]["Class"];
        document.getElementById("toggleButton").click();
      }
    })
  }

  ngOnDestroy() {
    this.studentsSubscription.unsubscribe();
    this.studentsTakenSubscription.unsubscribe();
  }

  deleteStudent(index: number) {
    let name = this.students.splice(index, 1)[0];
    this.studentsService.remove(name);
  }

  removeTaken() {
    this.studentsService.removeTaken();
  }

  swapTop(index: number) {
    [this.students[index - 1], this.students[index]] = [this.students[index], this.students[index - 1]];
  }

  swapBot(index: number) {
    [this.students[index + 1], this.students[index]] = [this.students[index], this.students[index + 1]];
  }

}
