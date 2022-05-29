import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsInvoicesComponent } from './items-invoices.component';

describe('ItemsInvoicesComponent', () => {
  let component: ItemsInvoicesComponent;
  let fixture: ComponentFixture<ItemsInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
