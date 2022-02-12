import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewUserModalComponent } from './renew-user-modal.component';

describe('RenewUserModalComponent', () => {
  let component: RenewUserModalComponent;
  let fixture: ComponentFixture<RenewUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewUserModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
