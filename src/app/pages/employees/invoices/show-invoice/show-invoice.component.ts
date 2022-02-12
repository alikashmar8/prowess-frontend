import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    try {
      this.invoice = await this.invoicesService.getById(this.invoiceId);
      this.isLoading = this.loadingService.appLoading(false);
    } catch (e) {
      this.authService.handleHttpError(e);
    }
  }

  getAddressString(address) {
    return getAddressString(address);
  }
}
