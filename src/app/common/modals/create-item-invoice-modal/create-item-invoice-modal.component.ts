import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ItemsService } from 'src/app/services/items.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateInvoiceDTO } from 'src/dtos/create-invoice.dto';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-create-item-invoice-modal',
  templateUrl: './create-item-invoice-modal.component.html',
  styleUrls: ['./create-item-invoice-modal.component.css'],
})
export class CreateItemInvoiceModal implements OnInit {
  @Input() customer_id: string = null;

  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private invoicesService: InvoicesService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal
  ) {}

  data: CreateInvoiceDTO = {
    company_id: this.authService.currentUser.company_id,
    collectedBy_id: this.authService.currentUser.id,
    collected_at: new Date(),
    dueDate: new Date(),
    extraAmount: 0,
    isFirstPayment: false,
    isPaid: true,
    total: 0,
    type: InvoiceTypes.ITEMS_INVOICE,
    user_id: this.customer_id,
    items: [],
    plans: [],
    notes: null,
  };

  isLoading = true;
  isStoreLoading = false;
  items: Item[] = [];

  itemsDropdownList = [];
  selectedItems: Item[] = [];
  itemDropdownSettings: IDropdownSettings = {};
  loadingGif = loadingGifUrl;

  ngOnInit(): void {
    this.isLoading = true;
    if (!this.customer_id) {
      this.activeModal.dismiss();
    }
    this.itemsService
      .getCompanyItems(this.authService.currentUser.company_id)
      .subscribe((results: any) => {
        results.forEach((item: Item) => {
          if (item.isActive) {
            this.items.push(item);
          }
        });
        // this.items = results;
        this.itemsDropdownList = this.items;
        this.itemDropdownSettings = {
          singleSelection: false,
          idField: 'id',
          textField: 'name',
          itemsShowLimit: 2,
          limitSelection: 2,
          allowSearchFilter: true,
        };
        this.isLoading = false;
      });
  }

  onItemSelect(event) {
    let itemsTotal = 0;
    this.selectedItems.forEach((plan) => {
      itemsTotal += Number(this.items.find((x) => x.id == plan.id).price);
    });
    if (this.data.extraAmount > 0) {
      this.data.total = Number(this.data.extraAmount);
      this.data.total += itemsTotal;
    } else {
      this.data.total = Number(itemsTotal);
    }
  }

  onItemDeSelect(event) {
    const price = Number(this.items.find((x) => x.id == event.id).price);
    this.data.total -= price;
  }

  store() {
    this.isStoreLoading = true;
    if (!this.data.total) {
      this.alertService.toastError('Please select items total');
      this.isStoreLoading = false;
      return;
    }
    this.data.items = this.selectedItems.map((item) => item.id);

    if (!this.data.items.length) {
      this.alertService.toastError('Please select at least one item');
      this.isStoreLoading = false;
      return;
    }

    this.data.user_id = this.customer_id;

    this.invoicesService.store(this.data).subscribe(
      (result: any) => {
        this.alertService.toastSuccess('Invoice created successfully');
        this.activeModal.close(result);
      },
      (err: any) => {
        this.alertService.toastError(err.error.message);
        this.isStoreLoading = false;
      }
    );
  }
}
