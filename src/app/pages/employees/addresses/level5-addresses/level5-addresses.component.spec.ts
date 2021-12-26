import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Level5AddressesComponent } from './level5-addresses.component';

describe('Level5AddressesComponent', () => {
  let component: Level5AddressesComponent;
  let fixture: ComponentFixture<Level5AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Level5AddressesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Level5AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
