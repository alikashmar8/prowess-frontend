import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowEmployeeModalComponent } from './show-employee-modal.component';

describe('ShowEmployeeModalComponent', () => {
  let component: ShowEmployeeModalComponent;
  let fixture: ComponentFixture<ShowEmployeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowEmployeeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
