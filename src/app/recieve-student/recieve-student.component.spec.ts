import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecieveStudentComponent } from './recieve-student.component';

describe('RecieveStudentComponent', () => {
  let component: RecieveStudentComponent;
  let fixture: ComponentFixture<RecieveStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecieveStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecieveStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
