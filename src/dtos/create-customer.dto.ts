export class CreateCustomerDTO {
  name: string;
  email?: string;
  phoneNumber?: string;
  address_id?: string;
  plans: string[];
  collector_id: string;
  company_id: string;
}
