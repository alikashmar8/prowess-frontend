import { InvoiceTypes } from './../enums/invoices-type.enum';
export class ListInvoicesParams {
  search?: string;
  type?: InvoiceTypes;
  employee_id?: string;
  plan_id?: string;
  startDate?: Date;
  endDate?: Date;
  isPaid?: boolean;
  level5Address?: string;
  level4Address?: string;
  level3Address?: string;
  level2Address?: string;
  level1Address?: string;
  take?: number;
  skip?: number;
}
