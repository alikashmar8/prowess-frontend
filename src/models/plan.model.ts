import { Company } from './company.model';
import { User } from './user.model';

export class Plan {
  id: string;

  name: string;

  price: number;

  isActive: boolean;

  company_id: string;

  company: Company;

  customers: User[]

  // invoices: Invoice[];
}
