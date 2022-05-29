import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/common/modals/confirmation-modal/confirmation-modal.component';
import { FilterModalComponent } from 'src/app/common/modals/filter-modal/filter-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Invoice } from 'src/models/invoice.model';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';
import { ModalType } from './../../../enums/modal-type.enum';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  @Input('invoices') invoices: Invoice[] = [];
  @Input('title') title: string = 'Invoices';
  @Input('showSearchByDate') showSearchByDate: boolean = false;
  @Input() showPlans: boolean = false;
  @Input() showItems: boolean = false;
  @Input() showFirstPayment: boolean = false;
  @Input() showActions: boolean = true;
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
  employees: User[] = [];
  plans: Plan[] = [];

  selectedEmployee: string = '';
  selectedPlan: string = '';
  startDateFilter: Date;
  endDateFilter: Date;

  constructor(
    private invoicesService: InvoicesService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private plansService: PlansService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.appLoading(true);
      this.currentUser = this.authService.currentUser;
      this.plansService.getCompanyPlans(this.currentUser.company_id).subscribe(
        (result: any) => {
          result.forEach((plan) => {
            this.plans.push(plan);
          });
          // this.plans = result;
          this.companiesService
            .getCompanyEmployees(this.currentUser.company_id)
            .subscribe(
              (result: any) => {
                this.employees = result;
                this.loadingService.appLoading(false);
              },
              (error) => {
                this.authService.handleHttpError(error);
              }
            );
        },
        (error) => {
          this.authService.handleHttpError(error);
        }
      );
    } catch (error) {
      this.authService.handleHttpError(error);
    }
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
    const data = {
      search: this.search,
      dateSearch: this.monthSearch,
    };
    this.searchAction.emit(data);
  }

  public downloadAsPDF() {
    this.exportPDF.emit(this.monthSearch);
  }

  public downloadAsExcel() {
    this.exportExcel.emit(this.monthSearch);
  }

  openFilterModal() {
    const modalRef = this.modalService.open(FilterModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.employees = this.employees;
    modalRef.componentInstance.plans = this.plans;
    modalRef.componentInstance.search = this.search;
    modalRef.componentInstance.startDateFilter = this.startDateFilter;
    modalRef.componentInstance.endDateFilter = this.endDateFilter;
    modalRef.componentInstance.selectedEmployee = this.selectedEmployee;
    modalRef.componentInstance.selectedPlan = this.selectedPlan;
    if (this.showItems) {
      modalRef.componentInstance.showPlansFilter = false;
    }
    modalRef.result.then(
      (result) => {
        if (result) {
          this.search = result.search;
          this.startDateFilter = result.startDateFilter;
          this.endDateFilter = result.endDateFilter;
          this.selectedEmployee = result.selectedEmployee;
          this.selectedPlan = result.selectedPlan;
          this.searchAction.emit({
            search: result.search,
            startDateFilter: result.startDateFilter,
            endDateFilter: result.endDateFilter,
            selectedEmployee: result.selectedEmployee,
            selectedPlan: result.selectedPlan,
          });
        }
      },
      (rejected) => {}
    );
  }
}
