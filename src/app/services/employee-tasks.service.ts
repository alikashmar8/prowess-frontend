import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { employeeTasksEndpoint } from 'src/constants/api-constants';
import { EmployeeTaskPriority } from 'src/enums/employee-task-priority.enum';
import { EmployeeTaskStatus } from 'src/enums/employee-task-status';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';
import { EmployeeTask } from 'src/models/employee-task.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTasksService {
  async getById(taskId: string): Promise<EmployeeTask> {
    const result = await firstValueFrom(
      this.http.get(employeeTasksEndpoint + `${taskId}`, {
        headers: getHeaders(),
      })
    );

    return result as EmployeeTask;
  }
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getAll({ skip, take }): Promise<any> {
    return await firstValueFrom(
      this.http.get(employeeTasksEndpoint + `?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
      })
    );
  }

  create(data: any) {
    return this.http.post(employeeTasksEndpoint, data, {
      headers: getHeaders(),
    });
  }

  delete(id: string) {
    return this.http.delete(employeeTasksEndpoint + `${id}`, {
      headers: getHeaders(),
    });
  }

  update(
    id: any,
    data: {
      status?: EmployeeTaskStatus;
      finishDate?: Date;
      priority?: EmployeeTaskPriority;
    }
  ) {
    return this.http.patch(employeeTasksEndpoint + `${id}`, data, {
      headers: getHeaders(),
    });
  }
}
