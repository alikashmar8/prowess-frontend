import { AddressesLevel } from 'src/enums/addresses.enum';

export class AdminEditCompanyDTO {
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
  createdBy_id: string;
}
