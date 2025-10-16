import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { Currency } from './../enums/currency.enum';
import { Item } from './item.model';
import { Plan } from './plan.model';
import { User } from './user.model';

export class Invoice {
  id: string;
  total: number;
  extraAmount: number;
  isPaid: boolean;
  dueDate: Date;
  type: InvoiceTypes;
  isFirstPayment: boolean;
  notes?: string;
  user_id: string;
  collectedBy_id: string;
  item_id?: string;
  plan_id?: string;
  displayTotal?: number;
  displayCurrency?: Currency;
  user: User;
  collectedBy?: User;
  items?: Item[];
  plans?: Plan[];
  collected_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}
