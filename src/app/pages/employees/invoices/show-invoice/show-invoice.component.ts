import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';
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
  constructor(
    private loadingService: LoadingService,
    private invoicesService: InvoicesService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private readonly location: Location
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    this.invoiceId = this.route.snapshot.paramMap.get('id');
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
}
