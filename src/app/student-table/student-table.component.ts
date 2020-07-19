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

  constructor(private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.studentsSubscription = this.studentsService.studentsSubject.subscribe(studentList => {
      this.students = studentList;
    });
  }

  ngOnDestroy() {
    this.studentsSubscription.unsubscribe();
  }

  deleteStudent(index: number) {
    this.students.splice(index, 1);
  }

  swapTop(index: number) {
    [this.students[index - 1], this.students[index]] = [this.students[index], this.students[index - 1]];
  }

  swapBot(index: number) {
    [this.students[index + 1], this.students[index]] = [this.students[index], this.students[index + 1]];
  }

}
