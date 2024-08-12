import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { usersEndpoint } from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  async generateNewInvoice(data: {
    customer_id: string;
    plan_id: any;
    counterValue: number;
    dueDate: Date;
  }) {
    return await this.http
      .post(
        usersEndpoint +
          `${data.customer_id}/plans/${data.plan_id}/generateNewInvoice/`,
        data,
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

  update(employeeId: string, data: { [x: string]: any }) {
    return this.http.patch(usersEndpoint + employeeId, data, {
      headers: getHeaders(),
    });
  }

  updateRole(employeeId: string, data: { [x: string]: any }) {
    return this.http.patch(usersEndpoint + employeeId + '/roles', data, {
      headers: getHeaders(),
    });
  }

  delete(id: string) {
    return this.http.delete(usersEndpoint + `${id}`, { headers: getHeaders() });
  }

  async getCustomersWithPendingUnpaidInvoices(params: {
    take: number;
    skip: number;
  }): Promise<any> {
    let queryParam = `?skip=${params.skip}&take=${params.take}`;
    return await firstValueFrom(
      this.http.get<{ data: any[] }>(
        `${usersEndpoint}pending-unpaid${queryParam}`,
        { headers: getHeaders() }
      )
    );
  }
}
