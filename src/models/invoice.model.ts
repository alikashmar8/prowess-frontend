import { InvoiceTypes } from 'src/enums/invoices-type.enum';
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
  item_id?: string;
  plan_id?: string;
  user: User;
  // items?: Item;
  plans?: Plan[];
  created_at?: Date;
  updated_at?: Date;
}
