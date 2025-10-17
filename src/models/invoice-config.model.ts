import { Currency } from './../enums/currency.enum';
import { Company } from './company.model';

export class InvoiceConfig {
  id: number;
  printInvoiceId?: boolean;
  printCustomerName?: boolean;
  printInvoicePlans?: boolean;
  displayCurrency?: Currency;
  exchangeRate?: number;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
}
