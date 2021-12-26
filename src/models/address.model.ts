import { User } from './user.model';

export class Address {
  id: string;
  country?: string;
  district?: string;
  city?: string;
  area?: string;
  street?: string;
  building?: string;
  notes?: string;
}
