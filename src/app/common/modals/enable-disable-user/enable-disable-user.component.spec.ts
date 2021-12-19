import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableDisableUserComponent } from './enable-disable-user.component';

describe('EnableDisableUserComponent', () => {
  let component: EnableDisableUserComponent;
  let fixture: ComponentFixture<EnableDisableUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableDisableUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableDisableUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
