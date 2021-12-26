import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level4AddressesComponent } from './level4-addresses.component';

describe('Level4AddressesComponent', () => {
  let component: Level4AddressesComponent;
  let fixture: ComponentFixture<Level4AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level4AddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level4AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
