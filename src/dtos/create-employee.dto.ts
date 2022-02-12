import { UserRoles } from 'src/enums/user-roles.enum';

export class CreateEmployeeDTO {
  name: string;
  username: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  company_id: string;
  role: string;
  expiryDate: Date;
}
