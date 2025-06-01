import { Company } from './company.model';

export class InvoiceConfig {
  id: number;
  printInvoiceId?: boolean;
  printCustomerName?: boolean;
  printInvoicePlans?: boolean;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
}
