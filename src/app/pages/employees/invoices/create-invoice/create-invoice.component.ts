import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { ItemsService } from 'src/app/services/items.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateInvoiceDTO } from 'src/dtos/create-invoice.dto';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { Item } from 'src/models/item.model';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css'],
})
export class CreateInvoiceComponent implements OnInit {
  data: CreateInvoiceDTO = {
    company_id: null,
    dueDate: null,
    extraAmount: 0,
    isFirstPayment: false,
    isPaid: false,
    total: 0,
    type: InvoiceTypes.PLANS_INVOICE,
    user_id: null,
    items: [],
    plans: [],
    notes: null,
  };
  isStoreLoading: boolean = false;
  loadingGifUrl: string = loadingGifUrl;
  isLoading: boolean = true;
  customers: User[] = [];
  plans: Plan[] = [];
  items: Item[] = [];

  plansDropdownList = [];
  selectedPlans: Plan[] = [];
  planDropdownSettings: IDropdownSettings = {};

  itemsDropdownList = [];
  selectedItems: Item[] = [];
  itemDropdownSettings: IDropdownSettings = {};

  customersDropdownList = [];
  selectedCustomer: User[] = [];
  customerDropdownSettings: IDropdownSettings = {};

  constructor(
    private invoicesService: InvoicesService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private plansService: PlansService,
    private companiesService: CompaniesService,
    private itemsService: ItemsService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService
      .getCompanyCustomers(this.authService.currentUser.company_id, 9999999, 0)
      .subscribe(
        (res: any) => {
          this.customers = res;
          this.customersDropdownList = res.data;
          this.customerDropdownSettings = {
            singleSelection: true,
            idField: 'id',
            textField: 'name',
            itemsShowLimit: 2,
            limitSelection: 2,
            allowSearchFilter: true,
          };
          this.plansService
            .getCompanyPlans(this.authService.currentUser.company_id)
            .subscribe(
              (res: any) => {
                this.plans = res;
                this.plansDropdownList = res;
                this.planDropdownSettings = {
                  singleSelection: false,
                  idField: 'id',
                  textField: 'name',
                  itemsShowLimit: 2,
                  limitSelection: 2,
                  allowSearchFilter: true,
                };
                this.itemsService
                  .getCompanyItems(this.authService.currentUser.company_id)
                  .subscribe((results: any) => {
                    this.items = results;
                    this.itemsDropdownList = results;
                    this.itemDropdownSettings = {
                      singleSelection: false,
                      idField: 'id',
                      textField: 'name',
                      itemsShowLimit: 2,
                      limitSelection: 2,
                      allowSearchFilter: true,
                    };
                    this.isLoading = this.loadingService.appLoading(false);
                  });
              },
              (err) => {
                this.authService.handleHttpError(err);
                this.isLoading = this.loadingService.appLoading(false);
              }
            );
        },
        (err) => {
          this.authService.handleHttpError(err);
          this.isLoading = this.loadingService.appLoading(false);
        }
      );
  }

  onPlanSelect(event) {
    let plansTotal = 0;
    this.selectedPlans.forEach((plan) => {
      plansTotal += Number(this.plans.find((x) => x.id == plan.id).price);
    });
    if (this.data.total > 0) {
      this.data.total = Number(this.data.extraAmount);
      this.data.total += plansTotal;
    } else {
      this.data.total = Number(plansTotal);
    }
    // TODO: remove selected item
    this.selectedItems = [];
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
    // TODO: remove selected item
    this.selectedPlans = [];
  }

  onPlanDeSelect(event) {
    const price = Number(this.plans.find((x) => x.id == event.id).price);
    this.data.total -= price;
  }

  onItemDeSelect(event) {
    const price = Number(this.items.find((x) => x.id == event.id).price);
    this.data.total -= price;
  }

  extraAmountChanged() {
    const extraAmount: number = Number(this.data.extraAmount);

    let plansTotal = 0;
    let itemsTotal = 0;
    this.selectedPlans.forEach((plan) => {
      plansTotal += Number(this.plans.find((x) => x.id == plan.id).price);
    });

    this.selectedItems.forEach((item) => {
      itemsTotal += Number(this.items.find((x) => x.id == item.id).price);
    });

    // const itemPrice = Number(this.plans.find((x) => x.id == selectedItem.id).price);
    this.data.total = extraAmount + plansTotal + itemsTotal;
  }
  store() {
    this.isStoreLoading = true;

    if (!this.selectedCustomer) {
      this.alertService.toastError(
        'Please select a customer before proceeding!'
      );
      this.isStoreLoading = false;
      return;
    }

    this.data.user_id = this.selectedCustomer[0].id;

    // TODO: check selected item too
    if (!this.selectedPlans && !this.selectedItems) {
      this.alertService.toastError(
        'You need to select a plan or item for the invoice.'
      );
      this.isStoreLoading = false;
      return;
    }

    this.data.plans = this.selectedPlans.map((plan) => plan.id);
    this.data.items = this.selectedItems.map((item) => item.id);

    this.data.company_id = this.authService.currentUser.company_id;

    this.invoicesService.store(this.data).subscribe(
      (res) => {
        this.alertService.toastSuccess('Invoice added successfully');
        this.isStoreLoading = false;
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isStoreLoading = false;
      }
    );

    // if(this.data.)
    // if select plan not null => invoice type = plan
  }
}
