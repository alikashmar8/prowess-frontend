import { Company } from './company.model';
import { EmployeeTask } from './employee-task.model';

export class EmployeeTaskType {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  company: Company;
  employeeTasks: EmployeeTask[];
}
