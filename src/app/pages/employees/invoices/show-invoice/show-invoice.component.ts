import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmation-modal/confirmation-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ModalType } from 'src/enums/modal-type.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Invoice } from 'src/models/invoice.model';
import { User } from 'src/models/user.model';
import { getAddressString } from 'src/utils/functions';

@Component({
  selector: 'app-show-invoice',
  templateUrl: './show-invoice.component.html',
  styleUrls: ['./show-invoice.component.css'],
})
export class ShowInvoiceComponent implements OnInit {
  isLoading: boolean = false;
  invoice: Invoice;
  invoiceId: string;
  currentUser: User;
  UserRole = UserRoles;

  constructor(
    private loadingService: LoadingService,
    private invoicesService: InvoicesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private readonly location: Location,
    private modalService: NgbModal
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.currentUser;
    if (!this.invoiceId) {
      this.alertService.toastError('No invoice id provided');
      this.goBack();
      return;
    }
    try {
      this.invoice = await this.invoicesService.getById(this.invoiceId);
      this.isLoading = this.loadingService.appLoading(false);
    } catch (e) {
      this.authService.handleHttpError(e);
      this.goBack();
      return;
    }
  }

  getAddressString(address) {
    return getAddressString(address);
  }

  async downloadPDF() {
    try {
      await this.invoicesService.downloadInvoicePdf(this.invoiceId);
    } catch (e) {
      console.log(e);
    }
  }

  goBack() {
    let canGoBack = !!this.router.getCurrentNavigation()?.previousNavigation;
    if (canGoBack) {
      this.location.back();
    } else {
      this.router.navigate(['..'], { relativeTo: this.route });
    }
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
    modalRef.componentInstance.type = ModalType.FORGIVE_INVOICE;
    modalRef.componentInstance.message =
      'Are you sure you want to forgive invoice: ' +
      invoice_id +
      ' for ' +
      customer_name +
      '?';
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
}
