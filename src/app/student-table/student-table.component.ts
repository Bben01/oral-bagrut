import { StudentsService } from './../services/students.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngbd-modal',
  templateUrl: './modal.component.html'
})
export class NgbdModal {
  @Input() text: string;

  constructor(public modal: NgbActiveModal) { }

}

@Component({
  selector: 'app-student-table',
  templateUrl: './student-table.component.html',
  styleUrls: ['./student-table.component.scss']
})
export class StudentTableComponent implements OnInit, OnDestroy {
  students: string[];
  studentsTaken: { Class: string; Name: string; }[];
  studentsSubscription: Subscription;
  studentsTakenSubscription: Subscription;

  constructor(private studentsService: StudentsService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.studentsSubscription = this.studentsService.studentsSubject.subscribe(studentList => {
      this.students = studentList;
    });
    this.studentsTakenSubscription = this.studentsService.studentsTakenSubject.subscribe(studentsTaken => {
      this.studentsTaken = studentsTaken;
      this.toggleTaken();
    });
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
    this.studentsService.synchonise();
  }

  swapBot(index: number) {
    [this.students[index + 1], this.students[index]] = [this.students[index], this.students[index + 1]];
    this.studentsService.synchonise();
  }

  toggleTaken() {
    if (this.studentsTaken.length > 0 && !this.modalService.hasOpenModals()) {
      const currentStudent = this.studentsTaken[0];
      setTimeout((_: any) => {
        const modalRef = this.modalService.open(NgbdModal, { centered: true });
        modalRef.componentInstance.text = "You can send " + currentStudent.Name + " to " + currentStudent.Class;
        modalRef.result.then(_ => {
          this.toggleTaken();
        }).catch(_ => {
          this.toggleTaken();
        });
      }, 500);
      this.removeTaken();
    }
  }
}
