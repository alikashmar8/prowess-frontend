import { jsPDF } from 'jspdf';
import { User } from 'src/models/user.model';
import { ModalType } from './../../../enums/modal-type.enum';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmation-modal/confirmation-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';
import { UserRoles } from 'src/enums/user-roles.enum';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  @Input('invoices') invoices: Invoice[] = [];
  @Input('title') title: string = 'Invoices';
  @Input('showSearchByDate') showSearchByDate: boolean = false;
  @Output() searchAction = new EventEmitter<any>();
  @Output() exportPDF = new EventEmitter<any>();
  @Output() exportExcel = new EventEmitter<any>();
  @ViewChild('invoicesTable') invoicesTable: ElementRef;

  currentUser: User;
  UserRole = UserRoles;
  search: string = '';
  monthSearch: Date = new Date();
  selectedRowIds: Set<number> = new Set<number>();
  selectedId: string;

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

  submitSearch() {
    const data= {
      search: this.search,
      dateSearch: this.monthSearch
    }
    this.searchAction.emit(data);
  }

  public downloadAsPDF() {
    this.exportPDF.emit(this.monthSearch);
  }

  public downloadAsExcel() {
    this.exportExcel.emit(this.monthSearch);
  }
}
