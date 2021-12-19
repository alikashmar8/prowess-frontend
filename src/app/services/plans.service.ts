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
    return this.http.get(plansEndpoint + 'company/' + company_id, {
      headers: getHeaders(),
    });
  }

  getActiveCompanyPlans() {
    return this.http.get(
      plansEndpoint +
        'company/' +
        this.authService.currentUser.company_id +
        '?isActive=true',
      {
        headers: getHeaders(),
      }
    );
  }

  store(data: CreatePlanDTO) {
    return this.http.post(
      plansEndpoint + 'company/' + this.authService.currentUser.company_id,
      data,
      { headers: getHeaders() }
    );
  }
}
