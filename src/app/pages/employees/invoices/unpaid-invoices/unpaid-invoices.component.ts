import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Invoice } from 'src/models/invoice.model';

@Component({
  selector: 'app-unpaid-invoices',
  templateUrl: './unpaid-invoices.component.html',
  styleUrls: ['./unpaid-invoices.component.css'],
})
export class UnpaidInvoicesComponent implements OnInit {
  isLoading: boolean = true;
  invoices: Invoice[] = [];
  today = new Date();
  constructor(
    private invoicesService: InvoicesService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = this.loadingService.appLoading(true)
      this.invoices = await this.invoicesService.getUnpaidInvoices()
      this.isLoading = this.loadingService.appLoading(false)
    } catch (err) {
      this.authService.handleHttpError(err)
      this.isLoading = this.loadingService.appLoading(false)
    }
  }
}
