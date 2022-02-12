import { InvoiceTypes } from 'src/enums/invoices-type.enum';

export class CreateInvoiceDTO {
  user_id: string;
  plans?: string[];
  items?: string[];
  total: number;
  extraAmount: number;
  isPaid: boolean;
  dueDate: Date;
  type: InvoiceTypes;
  isFirstPayment: boolean;
  notes?: string;
  company_id: string;
}
