import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { employeeTaskTypesEndpoint } from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTaskTypesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getAll({ skip, take }): Promise<any> {
    return await firstValueFrom(
      this.http.get(employeeTaskTypesEndpoint + `?skip=${skip}&take=${take}`, {
        headers: getHeaders(),
      })
    );
  }

  create(data: any) {
    return this.http.post(employeeTaskTypesEndpoint, data, {
      headers: getHeaders(),
    });
  }

  update(id: string, data: { name?: string; description?: string }) {
    return this.http.patch(employeeTaskTypesEndpoint + `${id}`, data, {
      headers: getHeaders(),
    });
  }
  delete(id: any) {
    return this.http.delete(employeeTaskTypesEndpoint + `${id}`, {
      headers: getHeaders(),
    });
  }
}
