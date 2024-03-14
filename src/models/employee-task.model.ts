import { EmployeeTaskCategory } from 'src/enums/employee-task-category.enum';
import { EmployeeTaskPriority } from 'src/enums/employee-task-priority.enum';
import { EmployeeTaskStatus } from 'src/enums/employee-task-status';
import { Company } from './company.model';
import { EmployeeTaskSupportingEmployee } from './employee-task-supporting-employee.model';
import { EmployeeTaskType } from './employee-task-type.model';
import { User } from './user.model';

export class EmployeeTask {
  id: string; //
  employeeId?: string; //
  customerId?: string; //
  taskTypeId: string; //
  description?: string;  //
  result?: string; //
  category: EmployeeTaskCategory; //
  priority: EmployeeTaskPriority;//
  status: EmployeeTaskStatus;//
  companyId: string;//
  createdById: string; //
  startDate?: Date; //
  finishDate?: Date; //
  createdAt: Date; //
  updatedAt: Date; //
  company: Company; //
  taskType: EmployeeTaskType; //
  employee: User; //
  customer?: User;//
  createdBy: User;//
  supportingEmployees: EmployeeTaskSupportingEmployee[];
}
