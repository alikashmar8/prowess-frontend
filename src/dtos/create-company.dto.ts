import { Currency } from 'src/enums/currency.enum';
import { AddressesLevel } from './../enums/addresses.enum';
import { CollectingType } from './../enums/collecting-type.enum';
import { CompanyInvoicesType } from './../enums/company-invoices-type.enum';
import { InvoicesSortingType } from './../enums/invoices-sorting-type';

export class AdminCreateCompanyDTO {
  name: string;
  balance: number;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  email?: string;
  maxManagersNumber: number;
  maxSupervisorsNumber: number;
  maxCollectorsNumber: number;
  maxCustomersNumber: number;
  managerAccountPrice: number;
  supervisorAccountPrice: number;
  collectorAccountPrice: number;
  currency: Currency;
  collectingType: CollectingType;
  invoicesSortingType: InvoicesSortingType;
  maxLocationLevel: AddressesLevel;
  allowDataImport: boolean;
  addressLevel1Name: string;
  addressLevel2Name: string;
  addressLevel3Name: string;
  addressLevel4Name: string;
  addressLevel5Name: string;
  invoicesType: CompanyInvoicesType;
  pricePerCounter?: number;
}
