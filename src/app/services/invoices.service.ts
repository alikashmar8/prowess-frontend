import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invoicesEndpoint } from 'src/constants/api-constants';
import { CreateInvoiceDTO } from 'src/dtos/create-invoice.dto';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  async getUnpaidInvoices(): Promise<any> {
    return await this.http
      .get(
        invoicesEndpoint + this.authService.currentUser.company_id + '/unpaid',
        { headers: getHeaders() }
      )
      .toPromise();
  }

  async getThisMonthInvoices(): Promise<any> {
    return await this.http
      .get(
        invoicesEndpoint +
          this.authService.currentUser.company_id +
          '/this-month',
        { headers: getHeaders() }
      )
      .toPromise();
  }

  async getById(id: string): Promise<any> {
    return await this.http
      .get(
        invoicesEndpoint +
          this.authService.currentUser.company_id +
          '/invoice/' +
          id,
        { headers: getHeaders() }
      )
      .toPromise();
  }

  store(data: CreateInvoiceDTO) {
    return this.http.post(
      invoicesEndpoint + this.authService.currentUser.company_id,
      data,
      { headers: getHeaders() }
    );
  }

  forgive(ids: string[]) {
    return this.http.put(
      invoicesEndpoint + this.authService.currentUser.company_id + '/forgive',
      { ids },
      { headers: getHeaders() }
    );
  }

  collectInvoice(ids: string[], collector_id: string) {
    return this.http.put(
      invoicesEndpoint + this.authService.currentUser.company_id + '/collect',
      { ids, collector_id },
      { headers: getHeaders() }
    );
  }

  getCustomerItemsInvoices(customer_id: string): Promise<any> {
    return this.http
      .get(
        invoicesEndpoint +
          'customer/' +
          customer_id +
          '?type=' +
          InvoiceTypes.ITEMS_INVOICE,
        { headers: getHeaders() }
      )
      .toPromise();
  }
}
