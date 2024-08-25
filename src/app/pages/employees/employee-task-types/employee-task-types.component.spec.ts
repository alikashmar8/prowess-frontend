import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskTypesComponent } from './employee-task-types.component';

describe('EmployeeTaskTypesComponent', () => {
  let component: EmployeeTaskTypesComponent;
  let fixture: ComponentFixture<EmployeeTaskTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeTaskTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeTaskTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
