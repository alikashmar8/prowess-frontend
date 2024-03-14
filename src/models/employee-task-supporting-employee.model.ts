import { EmployeeTask } from './employee-task.model';
import { User } from './user.model';

export class EmployeeTaskSupportingEmployee {
  id: string;
  taskId: string;
  employeeId: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  task: EmployeeTask;
  employee: User;
}
