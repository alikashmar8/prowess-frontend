import { UserRoles } from 'src/enums/user-roles.enum';
import { Address } from './address.model';
import { Company } from './company.model';
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

  address_id?: string;

  company_id?: string;

  address: Address;

  companies: Company[];

  company: Company;

  collector: User;

  plans: Plan[];

  // invoices: Invoice[];

  created_at: Date;
  updated_at: Date;
}
