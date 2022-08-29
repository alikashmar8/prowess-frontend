import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invoicesEndpoint } from 'src/constants/api-constants';
import { CreateInvoiceDTO } from 'src/dtos/create-invoice.dto';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { getHeaders } from 'src/utils/functions';
import { URLSearchParams } from 'url';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  async getItemsInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    let searchString = '?type=' + InvoiceTypes.ITEMS_INVOICE;
    if (data?.search) {
      searchString = `&search=${data.search}`;
    }
    if (data?.employee_id) {
      searchString = `${searchString}&employee_id=${data.employee_id}`;
    }
    if (data?.plan_id) {
      searchString = `${searchString}&plan_id=${data.plan_id}`;
    }
    if (data?.startDate) {
      searchString = `${searchString}&start_date=${data.startDate}`;
    }
    if (data?.endDate) {
      searchString = `${searchString}&end_date=${data.endDate}`;
    }
    return await this.http
      .get(invoicesEndpoint + searchString, {
        headers: getHeaders(),
      })
      .toPromise();
  }
  constructor(private authService: AuthService, private http: HttpClient) {}

  async getUnpaidInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    let searchString = '';
    if (data?.search) {
      searchString = `search=${data.search}`;
    }
    if (data?.employee_id) {
      searchString = `${searchString}&employee_id=${data.employee_id}`;
    }
    if (data?.plan_id) {
      searchString = `${searchString}&plan_id=${data.plan_id}`;
    }
    if (data?.startDate) {
      searchString = `${searchString}&start_date=${data.startDate}`;
    }
    if (data?.endDate) {
      searchString = `${searchString}&end_date=${data.endDate}`;
    }
    return await this.http
      .get(invoicesEndpoint + 'unpaid?' + searchString, {
        headers: getHeaders(),
      })
      .toPromise();
  }

  async getPaidInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<any> {
    let searchString = '';
    if (data?.search) {
      searchString = `&search=${data.search}`;
    }
    if (data?.employee_id) {
      searchString = `${searchString}&employee_id=${data.employee_id}`;
    }
    if (data?.plan_id) {
      searchString = `${searchString}&plan_id=${data.plan_id}`;
    }
    if (data?.startDate) {
      searchString = `${searchString}&start_date=${data.startDate}`;
    }
    if (data?.endDate) {
      searchString = `${searchString}&end_date=${data.endDate}`;
    }
    return await this.http
      .get(invoicesEndpoint + '?isPaid=true' + searchString, {
        headers: getHeaders(),
      })
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
      .get(invoicesEndpoint + id, { headers: getHeaders() })
      .toPromise();
  }

  store(data: CreateInvoiceDTO) {
    return this.http.post(invoicesEndpoint, data, { headers: getHeaders() });
  }

  forgive(ids: string[], collector_id: string) {
    return this.http.put(
      invoicesEndpoint + 'forgive',
      { ids, collector_id },
      { headers: getHeaders() }
    );
  }

  collectInvoice(ids: string[], collector_id: string) {
    return this.http.put(
      invoicesEndpoint + 'collect',
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

  async downloadPaidInvoicesPdf() {
    return await this.http
      .get(invoicesEndpoint + 'reports/pdf/paid/', {
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

  downloadInvoicesExcel(ids: string[]) {
    return this.http.post(
      invoicesEndpoint + 'reports/excel/',
      { ids },
      { headers: getHeaders(), responseType: 'blob' }
    );
  }

  downloadPaidInvoicesExcel() {
    return this.http.get(invoicesEndpoint + 'reports/excel/paid/', {
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

  async downloadInvoicesPdf(ids: string[]) {
    let params = '?';
    ids.forEach((id) => {
      params += '&ids=' + id;
    });
    return await this.http
      .get(invoicesEndpoint + 'reports/pdf/' + params, {
        headers: getHeaders(),
        responseType: 'blob',
      })
      .toPromise();
  }
}
