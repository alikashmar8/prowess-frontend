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

  async getUnpaidInvoices(search?: string): Promise<any> {
    if (!search) {
      search = '';
    }
    return await this.http
      .get(
        invoicesEndpoint +
          this.authService.currentUser.company_id +
          '/unpaid?search=' +
          search,
        { headers: getHeaders() }
      )
      .toPromise();
  }

  async getThisMonthInvoices(): Promise<any> {
    return await this.http
      .get(
        invoicesEndpoint + this.authService.currentUser.company_id + '/month',
        { headers: getHeaders() }
      )
      .toPromise();
  }

  async getInvoicesByMonth(data: {
    search?: string;
    dateSearch?: string;
  }): Promise<any> {
    console.log(data);

    if (!data.dateSearch) {
      data.dateSearch = new Date().toISOString();
    }
    if (!data.search) {
      data.search = '';
    }

    return await this.http
      .get(
        invoicesEndpoint +
          this.authService.currentUser.company_id +
          '/month?search=' +
          data.search +
          '&searchMonth=' +
          data.dateSearch,
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

  forgive(ids: string[], collector_id: string) {
    return this.http.put(
      invoicesEndpoint + this.authService.currentUser.company_id + '/forgive',
      { ids, collector_id },
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

  async downloadUnpaidInvoicesPdf() {
    return await this.http
      .get(invoicesEndpoint + 'reports/pdf/unpaid/', {
        headers: getHeaders(),
      })
      .toPromise();
  }

  async downloadInvoicesPdfByMonth(date) {
    return await this.http
      .get(invoicesEndpoint + 'reports/pdf/by-month/?date=' + date, {
        headers: getHeaders(),
      })
      .toPromise();
  }

  downloadUnpaidInvoicesExcel() {
    return this.http.get(invoicesEndpoint + 'reports/excel/unpaid/', {
      headers: getHeaders(),
      responseType: 'blob',
    });
  }

  downloadInvoicesExcelByMonth(date) {
    return this.http.get(
      invoicesEndpoint + 'reports/excel/by-month/?date=' + date,
      {
        headers: getHeaders(),
        responseType: 'blob',
      }
    );
  }

  async downloadInvoicePdf(id: string) {
    return await this.http
      .get(invoicesEndpoint + id + '/report/pdf/', {
        headers: getHeaders(),
        responseType: 'blob',
      })
      .toPromise();
  }
}
