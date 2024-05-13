import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';
import { firstValueFrom } from 'rxjs';
import { employeeTaskReasonsEndpoint } from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root'
})
export class EmployeeTaskReasonsService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  async getAll({ skip, take }): Promise<any> {
    return await firstValueFrom(
      this.http.get(employeeTaskReasonsEndpoint + `?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
      })
    );
  }

  create(data: any) {
    return this.http.post(employeeTaskReasonsEndpoint, data, {
      headers: getHeaders(),
    });
  }

  update(id: string, data: { name?: string; description?: string }) {
    return this.http.patch(employeeTaskReasonsEndpoint + `${id}`, data, {
      headers: getHeaders(),
    });
  }
  delete(id: any) {
    return this.http.delete(employeeTaskReasonsEndpoint + `${id}`, {
      headers: getHeaders(),
    });
  }
}
