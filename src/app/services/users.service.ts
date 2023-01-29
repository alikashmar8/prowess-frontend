import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usersEndpoint } from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  async generateNewInvoice(customer_id: string, plan_id: any) {
    return await this.http
      .post(
        usersEndpoint + `${customer_id}/plans/${plan_id}/generateNewInvoice/`,
        {},
        { headers: getHeaders() }
      )
      .toPromise();
  }

  async updateCustomerPlans(
    customer_id: string,
    data: { ids: string[]; invoice_total: number; invoice_note?: string }
  ) {
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

  activateCustomer(
    customer_id: string,
    data: { invoice_total: number; invoice_notes?: string }
  ) {
    return this.http.put(
      usersEndpoint + `${customer_id}/make-active`,
      { ...data },
      { headers: getHeaders() }
    );
  }
}
