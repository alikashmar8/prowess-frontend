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
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Invoice } from 'src/models/invoice.model';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';
import { getAddressString } from 'src/utils/functions';
import { ModalType } from './../../../enums/modal-type.enum';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
})
export class InvoicesListComponent implements OnInit {
  @Input('invoices') invoices: Invoice[] = [];
  @Input() total: string = '0';
  @Input('title') title: string = 'Invoices';
  @Input('showSearchByDate') showSearchByDate: boolean = false;
  @Input() showIsPaidFilter: boolean = false;
  @Input() showCollectAction: boolean = true;
  @Input() showForgiveAction: boolean = true;
  @Input() showPlans: boolean = false;
  @Input() showItems: boolean = false;
  @Input() showFirstPayment: boolean = false;
  @Input() showActions: boolean = true;
  @Input() showIsPaid: boolean = true;
  @Input() showPaidAt: boolean = false;
  @Input() take: number = 10;
  @Input() skip: number = 0;
  @Input() currentPage: number = 1;
  @Input() totalRecords: number = 0;
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
  totalPages: number =
    this.totalRecords > 0 ? Math.ceil(this.totalRecords / this.take) : 1;

  selectedEmployee: string = '';
  selectedPlan: string = '';
  isPaid: string = '';
  startDateFilter: Date;
  endDateFilter: Date;
  selectedLevel5Address: string;
  selectedLevel4Address: string;
  selectedLevel3Address: string;
  selectedLevel2Address: string;
  selectedLevel1Address: string;

  InvoiceType = InvoiceTypes;

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

  ngAfterViewChecked() {
    this.totalPages =
      this.totalRecords > 0 ? Math.ceil(this.totalRecords / this.take) : 1;
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
    modalRef.componentInstance.showIsPaidFilter = this.showIsPaidFilter;
    modalRef.componentInstance.isPaid = this.isPaid;
    modalRef.componentInstance.level5Address = this.selectedLevel5Address;
    modalRef.componentInstance.level4Address = this.selectedLevel4Address;
    modalRef.componentInstance.level3Address = this.selectedLevel3Address;
    modalRef.componentInstance.level2Address = this.selectedLevel2Address;
    modalRef.componentInstance.level1Address = this.selectedLevel1Address;
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
          this.isPaid = result.isPaid;
          this.selectedLevel1Address = result.level1Address;
          this.selectedLevel2Address = result.level2Address;
          this.selectedLevel3Address = result.level3Address;
          this.selectedLevel4Address = result.level4Address;
          this.selectedLevel5Address = result.level5Address;
          this.submitDataRequest(1);
        }
      },
      (rejected) => {}
    );
  }

  getAddressString(address) {
    return getAddressString(address);
  }

  counter(i: number) {
    return new Array(i);
  }

  submitDataRequest(pageNumber) {
    const skip = (pageNumber - 1) * this.take;
    this.currentPage = pageNumber;
    this.searchAction.emit({
      search: this.search,
      startDateFilter: this.startDateFilter,
      endDateFilter: this.endDateFilter,
      selectedEmployee: this.selectedEmployee,
      selectedPlan: this.selectedPlan,
      isPaid: this.isPaid,
      selectedLevel5Address: this.selectedLevel5Address,
      selectedLevel4Address: this.selectedLevel4Address,
      selectedLevel3Address: this.selectedLevel3Address,
      selectedLevel2Address: this.selectedLevel2Address,
      selectedLevel1Address: this.selectedLevel1Address,
      take: this.take,
      skip: skip,
    });
  }
}
