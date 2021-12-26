import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level1AddressesComponent } from './level1-addresses.component';

describe('Level1AddressesComponent', () => {
  let component: Level1AddressesComponent;
  let fixture: ComponentFixture<Level1AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level1AddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level1AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
