import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmation-modal/confirmation-modal.component';
import { CreateItemInvoiceModal } from 'src/app/common/modals/create-item-invoice-modal/create-item-invoice-modal.component';
import { CustomerItemsModal } from 'src/app/common/modals/customer-items-modal/customer-items-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users.service';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { ModalType } from 'src/enums/modal-type.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Invoice } from 'src/models/invoice.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrls: ['./show-customer.component.css'],
})
export class ShowCustomerComponent implements OnInit {
  isLoading: boolean = true;
  customer_id: string;
  customer: User;
  currentUser: User;
  UserRole = UserRoles;

  items: Invoice[] = [];

  isLevel5Allowed: boolean = false;
  isLevel4Allowed: boolean = false;
  isLevel3Allowed: boolean = false;
  isLevel2Allowed: boolean = false;

  monthNamesEn = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthNamesAr = [
    'كانون الأول',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor(
    private loadingService: LoadingService,
    private companiesService: CompaniesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private alertService: AlertService,
    private invoicesService: InvoicesService,
    private usersService: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    try {
      this.currentUser = await this.authService.currentUser;
      this.customer_id = this.route.snapshot.paramMap.get('id');
      this.customer = await this.companiesService.getCustomerById(
        this.customer_id
      );

      this.items = await this.invoicesService.getCustomerItemsInvoices(
        this.customer_id
      );

      //handle address permission
      switch (this.customer.company.maxLocationLevel) {
        case AddressesLevel.LEVEL5:
          this.isLevel5Allowed = true;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL4:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL3:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL2:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL1:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = false;
          break;
      }

      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  openCustomerItemsModal() {
    const modalRef = this.modalService.open(CustomerItemsModal, { size: 'lg' });
    modalRef.componentInstance.customer_id = this.customer_id;
    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (rejected) => {}
    );
  }

  openCollectModal(invoice_id: string, customer_name: string) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message =
      'Are you sure you want to collect invoice: ' +
      invoice_id +
      ' for ' +
      customer_name +
      '?';
    modalRef.componentInstance.type = ModalType.COLLECT_INVOICE;
    modalRef.result.then(
      (result) => {
        if (result) {
          if (result.collector_id) {
            this.invoicesService
              .collectInvoice([invoice_id], result.collector_id)
              .subscribe(
                (result: any) => {
                  this.alertService.toastSuccess(
                    'Invoice collected successfully'
                  );
                  window.location.reload();
                },
                (error) => {
                  this.authService.handleHttpError(error);
                }
              );
          } else {
            alert('Collector cannot be empty');
            return;
          }
        }
      },
      (rejected) => {}
    );
  }

  openForgiveModal(invoice_id: string, customer_name: string) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.message =
      'Are you sure you want to forgive invoice: ' +
      invoice_id +
      ' for ' +
      customer_name +
      '?';
    modalRef.componentInstance.type = ModalType.FORGIVE_INVOICE;
    modalRef.result.then(
      async (result) => {
        if (result) {
          if (result.collector_id) {
            this.forgive(invoice_id, result.collector_id);
          } else {
            alert('Collector cannot be empty');
            return;
          }
        }
      },
      (rejected) => {}
    );
  }

  forgive(id: string, collector_id: string) {
    this.loadingService.appLoading(true);
    this.invoicesService.forgive([id], collector_id).subscribe(
      (result) => {
        this.loadingService.appLoading(false);
        this.alertService.toastSuccess('Invoice forgive successful');
      },
      (error) => {
        this.loadingService.appLoading(false);
        this.authService.handleHttpError(error);
      }
    );
  }

  openCreateItemInvoiceModal() {
    const modalRef = this.modalService.open(CreateItemInvoiceModal);
    modalRef.componentInstance.customer_id = this.customer_id;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.items.push(result);
        }
      },
      (rejected) => {}
    );
  }

  async generateInvoice(plan_id) {
    const res = confirm('Are you sure you want to generate a new invoice?');
    if (res) {
      try {
        await this.usersService.generateNewInvoice(this.customer.id, plan_id);
      } catch (err) {
        this.authService.handleHttpError(err);
      }
    }
  }
}
