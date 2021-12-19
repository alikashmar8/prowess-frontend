import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperVisorsComponent } from './super-visors.component';

describe('SuperVisorsComponent', () => {
  let component: SuperVisorsComponent;
  let fixture: ComponentFixture<SuperVisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuperVisorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperVisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
