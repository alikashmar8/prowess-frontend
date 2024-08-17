import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployeeTaskModalComponent } from './show-employee-task-modal.component';

describe('ShowEmployeeTaskModalComponent', () => {
  let component: ShowEmployeeTaskModalComponent;
  let fixture: ComponentFixture<ShowEmployeeTaskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEmployeeTaskModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowEmployeeTaskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
