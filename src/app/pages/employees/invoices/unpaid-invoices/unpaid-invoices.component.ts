import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { Invoice } from 'src/models/invoice.model';
import { getLang } from 'src/utils/functions';

@Component({
  selector: 'app-unpaid-invoices',
  templateUrl: './unpaid-invoices.component.html',
  styleUrls: ['./unpaid-invoices.component.css'],
})
export class UnpaidInvoicesComponent implements OnInit {
  isLoading: boolean = true;
  invoices: Invoice[] = [];
  sum = '';
  today = new Date();
  currentUser;
  title = '';
  take: number = 10;
  skip: number = 0;
  totalRecords: number = 0;
  filters: Record<string, any> = {};

  constructor(
    private invoicesService: InvoicesService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      this.filters = {
        type: InvoiceTypes.PLANS_INVOICE,
        isPaid: false,
        take: this.take,
        skip: this.skip,
      };
      let res = await this.invoicesService.listInvoices(this.filters);
      this.invoices = res.data;
      this.sum = res.sum;
      this.totalRecords = res.count;
      this.currentUser = this.authService.currentUser;
      // get language
      var storedLang: string = getLang();
      if (storedLang) {
        if (storedLang == 'en') {
          this.title = 'Unpaid Invoices';
        } else if (storedLang == 'ar') {
          this.title = 'الفواتير الغير مدفوعة';
        }
      }
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async searchClicked(data: {
    search?: string;
    selectedEmployee?: string;
    selectedPlan?: string;
    startDateFilter?: Date;
    endDateFilter?: Date;
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
      this.filters = {
        type: InvoiceTypes.PLANS_INVOICE,
        isPaid: false,
        search: data.search,
        employee_id: data.selectedEmployee,
        plan_id: data.selectedPlan,
        startDate: data.startDateFilter,
        endDate: data.endDateFilter,
        level5Address: data.selectedLevel5Address,
        level4Address: data.selectedLevel4Address,
        level3Address: data.selectedLevel3Address,
        level2Address: data.selectedLevel2Address,
        level1Address: data.selectedLevel1Address,
        take: data.take,
        skip: data.skip,
      };

      let res = await this.invoicesService.listInvoices(this.filters);

      this.invoices = res.data;
      this.sum = res.sum;
      this.totalRecords = res.count;
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportPDF() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const ids = this.invoices.map((invoice) => invoice.id);
      const res = await this.invoicesService.downloadInvoicesPdf(ids);
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportExcel() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const res = this.invoicesService
        .downloadInvoicesExcel(this.filters)
        .subscribe(
          (res) => {
            var newBlob = new Blob([res], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const data = window.URL.createObjectURL(newBlob);
            var link = document.createElement('a');
            link.href = data;
            link.download =
              this.currentUser.company.name +
              '-unpaid-invoices-' +
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
            this.isLoading = this.loadingService.appLoading(false);
          },
          (err) => {
            console.log(err);
            this.isLoading = this.loadingService.appLoading(false);
          }
        );
    } catch (err) {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }
}
