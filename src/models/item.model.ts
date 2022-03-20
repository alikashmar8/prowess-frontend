import { Company } from './company.model';
import { Invoice } from './invoice.model';

export class Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isActive: boolean;
  company_id: string;
  company: Company;
  invoices: Invoice[];
  created_at: Date;
  updated_at: Date;
}
