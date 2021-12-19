export class AdminCreateCompanyDTO {
  name: string;
  balance: number;
  maxManagersNumber: number;
  maxSupervisorsNumber: number;
  maxCollectorsNumber: number;
  maxCustomersNumber: number;
  maxLocationToEnter: string;
  createdBy_id: string;
}
