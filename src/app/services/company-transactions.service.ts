import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  companyTransactionsEndpoint
} from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyTransactionService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async getAll(data: {
    skip: number;
    take: number;
    fromDate;
    toDate;
  }): Promise<any> {
    let queryParams = '';
    for (const key in data) {
      console.log(key + ' ' + data[key]);

      if (data[key]) {
        queryParams += `${key}=${data[key]}&`;
      }
    }

    return await firstValueFrom(
      this.http.get(companyTransactionsEndpoint + `?${queryParams}`, {
        headers: getHeaders(),
      })
    );
  }
}
