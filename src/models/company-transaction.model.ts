import { CompanyTransactionType } from 'src/enums/company-transaction-type.enum';
import { Company } from './company.model';
import { User } from './user.model';
import { Currency } from 'src/enums/currency.enum';

export class CompanyTransaction {
  id: string;
  created_at: Date;
  updated_at: Date;
  fromCompanyId?: string;
  toCompanyId?: string;
  employeeId?: string;
  amount: number;
  currency: Currency;
  description?: string;
  type: CompanyTransactionType;
  total?: number;
  fromCompany?: Company;
  toCompany: Company;
  employee: User;
}
