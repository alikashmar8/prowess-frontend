import { AddressesLevel } from 'src/enums/addresses.enum';
import { User } from './user.model';

export class Company {
  id: string;
  name: string;
  balance: number;
  maxManagersNumber: number;
  maxSupervisorsNumber: number;
  maxCollectorsNumber: number;
  maxCustomersNumber: number;
  maxLocationLevel: AddressesLevel;
  addressLevel1Name: string;
  addressLevel2Name: string;
  addressLevel3Name: string;
  addressLevel4Name: string;
  addressLevel5Name: string;
  createdBy_id?: string;
  parentCompany_id?: string;
  createdBy?: User;
  parentCompany?: Company;
  subCompanies: Company[];
  users: User[];
  // items: Item[];
}
