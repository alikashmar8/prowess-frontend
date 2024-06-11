import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListReceivedAmountsComponent } from './list-received-amounts.component';

describe('ListReceivedAmountsComponent', () => {
  let component: ListReceivedAmountsComponent;
  let fixture: ComponentFixture<ListReceivedAmountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListReceivedAmountsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListReceivedAmountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
