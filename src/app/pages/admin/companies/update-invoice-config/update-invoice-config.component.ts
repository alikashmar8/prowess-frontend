import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Currency } from 'src/enums/currency.enum';
import { InvoiceConfig } from 'src/models/invoice-config.model';
import { InvoiceConfigsService } from './../../../../services/invoice-config.service';

@Component({
  selector: 'app-update-invoice-config',
  templateUrl: './update-invoice-config.component.html',
  styleUrls: ['./update-invoice-config.component.css'],
})
export class UpdateInvoiceConfigComponent implements OnInit {
  invoiceConfigId: string;
  invoiceConfig: InvoiceConfig = {
    id: null,
    printInvoiceId: false,
    printCustomerName: false,
    printInvoicePlans: false,
    displayCurrency: null,
    exchangeRate: null,
    createdAt: null,
    updatedAt: null,
    company: null,
  };

  Currency = Currency;

  constructor(
    private route: ActivatedRoute,
    private invoiceConfigsService: InvoiceConfigsService
  ) {}

  ngOnInit(): void {
    this.invoiceConfigId = this.route.snapshot.paramMap.get('id');
    this.loadInvoiceConfig();
  }

  async loadInvoiceConfig() {
    this.invoiceConfig = await this.invoiceConfigsService.getById(
      this.invoiceConfigId
    );
  }

  async updateInvoiceConfig() {
    (
      await this.invoiceConfigsService.update(
        this.invoiceConfigId,
        this.invoiceConfig
      )
    ).subscribe(() => {
      alert('Invoice configuration updated successfully.');
    });
  }
}
