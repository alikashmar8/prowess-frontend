import { User } from 'src/models/user.model';
import { ModalType } from './../../../enums/modal-type.enum';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmation-modal/confirmation-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';
import { UserRoles } from 'src/enums/user-roles.enum';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  @Input('invoices') invoices: Invoice[] = [];
  @Input('title') title: string = 'Invoices';

  currentUser: User;
  UserRole = UserRoles;

  constructor(
    private invoicesService: InvoicesService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  selectedRowIds: Set<number> = new Set<number>();

  selectedId: string;

  onRowClick(id: number) {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
    } else {
      this.selectedRowIds.add(id);
    }
  }

  rowIsSelected(id: number) {
    return this.selectedRowIds.has(id);
  }

  forgive(id: string) {
    this.loadingService.appLoading(true);
    this.invoicesService.forgive([id]).subscribe(
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
          debugger;
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
    modalRef.result.then(
      async (result) => {
        if (result) {
          this.forgive(invoice_id);
        }
      },
      (rejected) => {}
    );
  }
}
