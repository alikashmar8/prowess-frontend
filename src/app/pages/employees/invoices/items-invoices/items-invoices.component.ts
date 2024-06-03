import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-items-invoices',
  templateUrl: './items-invoices.component.html',
  styleUrls: ['./items-invoices.component.css'],
})
export class ItemsInvoicesComponent implements OnInit {
  isLoading: boolean = true;
  invoices: Invoice[] = [];
  take: number = 10;
  skip: number = 0;
  totalRecords: number = 0;
  currentPage: number = 1;
  currentUser: User;
  totalPages: number;
  sum = '';

  constructor(
    private invoicesService: InvoicesService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.loadingService.appLoading(true);
      let res = await this.invoicesService.getItemsInvoices({
        take: this.take,
        skip: this.skip,
      });
      console.log(res);

      this.invoices = res.data;
      this.sum = res.sum;
      this.totalRecords = res.count;
      this.totalPages = res.count > 0 ? Math.ceil(res.count / this.take) : 1;
      this.currentUser = this.authService.currentUser;
      this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async searchClicked(data?: {
    search?: string;
    selectedEmployee?: string;
    selectedPlan?: string;
    startDateFilter?: Date;
    endDateFilter?: Date;
    isPaid?: string;
    selectedLevel5Address?: string;
    selectedLevel4Address?: string;
    selectedLevel3Address?: string;
    selectedLevel2Address?: string;
    selectedLevel1Address?: string;
    take?: number;
    skip?: number;
  }) {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const res = await this.invoicesService.getItemsInvoices({
        search: data.search,
        employee_id: data.selectedEmployee,
        plan_id: data.selectedPlan,
        startDate: data.startDateFilter,
        endDate: data.endDateFilter,
        isPaid: data.isPaid,
        level5Address: data.selectedLevel5Address,
        level4Address: data.selectedLevel4Address,
        level3Address: data.selectedLevel3Address,
        level2Address: data.selectedLevel2Address,
        level1Address: data.selectedLevel1Address,
        take: data.take,
        skip: data.skip,
      });
      this.invoices = res.data;
      this.sum = res.sum;
      this.totalRecords = res.count;
      this.totalPages = res.count > 0 ? Math.ceil(res.count / this.take) : 1;

      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportPDF() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const res = await this.invoicesService.downloadPaidInvoicesPdf();
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportExcel() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const ids = this.invoices.map((invoice) => invoice.id);
      const res = this.invoicesService.downloadInvoicesExcel(ids).subscribe(
        (res) => {
          var newBlob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement('a');
          link.href = data;
          link.download =
            this.currentUser.company.name +
            '-items-invoices-' +
            new Date().getDate() +
            '-' +
            (new Date().getMonth() + 1) +
            '-' +
            new Date().getFullYear() +
            '.xlsx';
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
          setTimeout(function () {
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
        },
        (err) => {
          console.log(err);
        }
      );
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }
}
