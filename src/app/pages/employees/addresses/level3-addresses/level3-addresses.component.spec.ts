import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level3AddressesComponent } from './level3-addresses.component';

describe('Level3AddressesComponent', () => {
  let component: Level3AddressesComponent;
  let fixture: ComponentFixture<Level3AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level3AddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level3AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
