import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usersEndpoint } from 'src/constants/api-constants';
import { User } from 'src/models/user.model';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  async updateCustomerPlans(
    customer_id: string,
    data: { ids: string[]; invoice_total: number; invoice_note?: string }
  ) {
    console.log('in service before request');

    return await this.http
      .patch(
        usersEndpoint + `${customer_id}/plans`,
        { ...data },
        { headers: getHeaders() }
      )
      .toPromise();
  }

  constructor(private http: HttpClient) {}

  makeUserActive(id: string) {
    return this.http.put(
      usersEndpoint + `${id}/make-active`,
      {},
      { headers: getHeaders() }
    );
  }

  makeUserInactive(id: string) {
    return this.http.put(
      usersEndpoint + `${id}/make-inactive`,
      {},
      { headers: getHeaders() }
    );
  }

  getUserById(id: string): Promise<any> {
    return this.http
      .get(usersEndpoint + `${id}`, { headers: getHeaders() })
      .toPromise();
  }
}
