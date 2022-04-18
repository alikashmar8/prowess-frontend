import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-this-month-invoices',
  templateUrl: './this-month-invoices.component.html',
  styleUrls: ['./this-month-invoices.component.css'],
})
export class ThisMonthInvoicesComponent implements OnInit {
  isLoading: boolean = true;
  invoices: Invoice[] = [];
  today = new Date();
  currentUser: User;
  constructor(
    private invoicesService: InvoicesService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      this.invoices = await this.invoicesService.getInvoicesByMonth({
        dateSearch: this.today.toISOString(),
      });
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
      this.isLoading = this.loadingService.appLoading(false);
    }
  }


  async searchClicked(data: { search?: string; dateSearch?: string }) {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      this.invoices = await this.invoicesService.getInvoicesByMonth(data);
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportPDF() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const res = await this.invoicesService.downloadUnpaidInvoicesPdf();
      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  async exportExcel() {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      const res = this.invoicesService.downloadUnpaidInvoicesExcel().subscribe(
        (res) => {
          var newBlob = new Blob([res], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const data = window.URL.createObjectURL(newBlob);
          var link = document.createElement('a');
          link.href = data;
          // date =
          link.download =
            this.currentUser.company.name +
            '-invoices-' +
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
