import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateCustomerDTO } from 'src/dtos/create-customer.dto';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { getHeaders } from 'src/utils/functions';
import {
  adminCompaniesEndpoint,
  companiesEndpoint,
} from './../../constants/api-constants';
import { AdminCreateCompanyDTO } from './../../dtos/create-company.dto';
import { AdminEditCompanyDTO } from './../../dtos/edit-company.dto';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class CompaniesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getAll() {
    return this.http.get(adminCompaniesEndpoint, { headers: getHeaders() });
  }

  adminStore(company: AdminCreateCompanyDTO) {
    return this.http.post(adminCompaniesEndpoint, company, {
      headers: getHeaders(),
    });
  }

  getById(id: string) {
    return this.http.get(adminCompaniesEndpoint + id, {
      headers: getHeaders(),
    });
  }

  adminUpdate(id: string, data: AdminEditCompanyDTO) {
    return this.http.put(adminCompaniesEndpoint + id, data, {
      headers: getHeaders(),
    });
  }

  adminDelete(id: string) {
    return this.http.delete(adminCompaniesEndpoint + id, {
      headers: getHeaders(),
    });
  }

  getCompanyEmployees(company_id: string, role?: UserRoles) {
    if (role) {
      return this.http.get(
        companiesEndpoint + company_id + `/employees?role=${role}`,
        {
          headers: getHeaders(),
        }
      );
    } else {
      return this.http.get(companiesEndpoint + company_id + '/employees', {
        headers: getHeaders(),
      });
    }
  }

  getCompanyCustomers(company_id: string, take: number, skip: number) {
    return this.http.get(
      companiesEndpoint + company_id + `/customers?take=${take}&skip=${skip}`,
      {
        headers: getHeaders(),
      }
    );
  }

  getCurrentCompany() {
    return this.http.get(companiesEndpoint + 'current_company', {
      headers: getHeaders(),
    });
  }

  storeCustomer(data: CreateCustomerDTO) {
    return this.http.post(
      companiesEndpoint +
        this.authService.currentUser.company_id +
        '/customers',
      data,
      {
        headers: getHeaders(),
      }
    );
  }

  getCustomerById(id: string): Promise<any> {
    return this.http
      .get(
        companiesEndpoint +
          this.authService.currentUser.company_id +
          `/customers/${id}`,
        { headers: getHeaders() }
      )
      .toPromise();
  }

  updateCustomer(customer_id: string, data: CreateCustomerDTO) {
    return this.http.put(
      companiesEndpoint +
        this.authService.currentUser.company_id +
        '/customers/' +
        customer_id,
      data,
      {
        headers: getHeaders(),
      }
    );
  }
}
