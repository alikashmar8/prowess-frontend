import { User } from "./user.model";

export class ReceivedAmount {
  id: string;
  amount: number;
  receivedDate: Date;
  employeeId?: string;
  employee: User;
  createdAt: Date;
  updatedAt: Date;
  total?: number;
}
