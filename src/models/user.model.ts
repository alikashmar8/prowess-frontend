import { UserRoles } from 'src/enums/user-roles.enum';
import { Company } from './company.model';
import { Invoice } from './invoice.model';
import { Level1Address } from './level1-address.model';
import { Plan } from './plan.model';

export class User {
  id: string;
  name: string;
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  isActive: boolean;
  expiryDate?: Date;
  role: UserRoles;
  isSuperAdmin: boolean;
  balance: number;
  paymentDate?: Date;
  address_id?: string;
  company_id?: string;
  collector_id?: string;
  address: Level1Address;
  companies: Company[];
  company: Company;
  collector?: User;
  plans: Plan[];
  invoices: Invoice[];
  created_at: Date;
  updated_at: Date;
  unpaidInvoices?: Invoice[];
}
