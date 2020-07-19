import { StudentsService } from './../services/students.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  addStudentForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private studentsService: StudentsService) { }

  ngOnInit(): void {
    this.addStudentForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  addStudent() {
    const name = this.addStudentForm.get("name").value;
    this.studentsService.add(name);
    this.addStudentForm.reset();
  }

}
