export class CreateCustomerDTO {
  name: string;
  email?: string;
  phoneNumber?: string;
  note?: string;
  address_id?: string;
  plans: string[];
  collector_id: string;
  company_id: string;
  paymentDate?: any;
  invoice_total: number;
  invoice_notes?: string;
  counterSerialNumber?: string;
  lastCounterValue?: number;
  isPerCounter?: boolean;
}
