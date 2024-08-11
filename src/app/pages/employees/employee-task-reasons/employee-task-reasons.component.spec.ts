import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskReasonsComponent } from './employee-task-reasons.component';

describe('EmployeeTaskReasonsComponent', () => {
  let component: EmployeeTaskReasonsComponent;
  let fixture: ComponentFixture<EmployeeTaskReasonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTaskReasonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTaskReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
