import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level2AddressesComponent } from './level2-addresses.component';

describe('Level2AddressesComponent', () => {
  let component: Level2AddressesComponent;
  let fixture: ComponentFixture<Level2AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level2AddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level2AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
