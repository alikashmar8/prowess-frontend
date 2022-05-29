import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plansEndpoint } from 'src/constants/api-constants';
import { CreatePlanDTO } from 'src/dtos/create-plan.dto';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class PlansService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCompanyPlans(company_id: string) {
    return this.http.get(plansEndpoint, {
      headers: getHeaders(),
    });
  }

  getActivePlans() {
    return this.http.get(
      plansEndpoint +
        '?isActive=true',
      {
        headers: getHeaders(),
      }
    );
  }

  store(data: CreatePlanDTO) {
    return this.http.post(
      plansEndpoint,
      data,
      { headers: getHeaders() }
    );
  }

  updateStatus(id: string, status: boolean) {
    return this.http.patch(
      plansEndpoint + id + '/status',
      { id, isActive: status },
      { headers: getHeaders() }
    );
  }

  update(id: string, data: { name: string; price: number; isActive: boolean }) {
    return this.http.put(
      plansEndpoint + id,
      { ...data, company_id: this.authService.currentUser.company_id },
      {
        headers: getHeaders(),
      }
    );
  }
}
