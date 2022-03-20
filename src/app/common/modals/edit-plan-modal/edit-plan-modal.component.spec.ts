import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlanModalComponent } from './edit-plan-modal.component';

describe('EditPlanModalComponent', () => {
  let component: EditPlanModalComponent;
  let fixture: ComponentFixture<EditPlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPlanModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
