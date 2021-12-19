export class CreateCustomerDTO {
  name: string;
  email?: string;
  phoneNumber?: string;
  address: {
    id?: string;
    country?: string;
    district?: string;
    city?: string;
    area?: string;
    street?: string;
    building?: string;
    notes?: string;
  };
  plans: string[];
  company_id: string;
}
