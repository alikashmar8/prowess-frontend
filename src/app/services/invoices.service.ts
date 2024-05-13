import { firstValueFrom } from 'rxjs';
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

  async getItemsInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
    isPaid?: string;
    level5Address?: string;
    level4Address?: string;
    level3Address?: string;
    level2Address?: string;
    level1Address?: string;
    take?: number;
    skip?: number;
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
    if (data?.isPaid) {
      searchString = `${searchString}&isPaid=${data.isPaid}`;
    }
    if (data?.take) {
      searchString = `${searchString}&take=${data.take}`;
    }
    if (data?.take) {
      searchString = `${searchString}&skip=${data.skip}`;
    }
    if (data?.level1Address) {
      searchString = `${searchString}&level1Address=${data.level1Address}`;
    } else if (data?.level2Address) {
      searchString = `${searchString}&level2Address=${data.level2Address}`;
    } else if (data?.level3Address) {
      searchString = `${searchString}&level3Address=${data.level3Address}`;
    } else if (data?.level4Address) {
      searchString = `${searchString}&level4Address=${data.level2Address}`;
    } else if (data?.level5Address) {
      searchString = `${searchString}&level5Address=${data.level1Address}`;
    }
    return await this.http
      .get(invoicesEndpoint + searchString, {
        headers: getHeaders(),
      })
      .toPromise();
  }

  async getUnpaidInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
    level5Address?: string;
    level4Address?: string;
    level3Address?: string;
    level2Address?: string;
    level1Address?: string;
    take?: number;
    skip?: number;
  }): Promise<any> {
    let searchString = '&';
    if (data?.search) {
      searchString = `${searchString}search=${data.search}`;
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
    if (data?.take) {
      searchString = `${searchString}&take=${data.take}`;
    }
    if (data?.skip) {
      searchString = `${searchString}&skip=${data.skip}`;
    }
    if (data?.level1Address) {
      searchString = `${searchString}&level1Address=${data.level1Address}`;
    } else if (data?.level2Address) {
      searchString = `${searchString}&level2Address=${data.level2Address}`;
    } else if (data?.level3Address) {
      searchString = `${searchString}&level3Address=${data.level3Address}`;
    } else if (data?.level4Address) {
      searchString = `${searchString}&level4Address=${data.level2Address}`;
    } else if (data?.level5Address) {
      searchString = `${searchString}&level5Address=${data.level1Address}`;
    }
    return await this.http
      .get(
        invoicesEndpoint +
          '?isPaid=false&type=' +
          InvoiceTypes.PLANS_INVOICE +
          searchString,
        {
          headers: getHeaders(),
        }
      )
      .toPromise();
  }

  async getPaidInvoices(data?: {
    search?: string;
    employee_id?: string;
    plan_id?: string;
    startDate?: Date;
    endDate?: Date;
    level5Address?: string;
    level4Address?: string;
    level3Address?: string;
    level2Address?: string;
    level1Address?: string;
    take?: number;
    skip?: number;
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
    if (data?.take) {
      searchString = `${searchString}&take=${data.take}`;
    }
    if (data?.skip) {
      searchString = `${searchString}&skip=${data.skip}`;
    }
    if (data?.level1Address) {
      searchString = `${searchString}&level1Address=${data.level1Address}`;
    } else if (data?.level2Address) {
      searchString = `${searchString}&level2Address=${data.level2Address}`;
    } else if (data?.level3Address) {
      searchString = `${searchString}&level3Address=${data.level3Address}`;
    } else if (data?.level4Address) {
      searchString = `${searchString}&level4Address=${data.level2Address}`;
    } else if (data?.level5Address) {
      searchString = `${searchString}&level5Address=${data.level1Address}`;
    }
    return await this.http
      .get(
        invoicesEndpoint +
          '?isPaid=true&type=' +
          InvoiceTypes.PLANS_INVOICE +
          '&orderBy=invoice.collected_at' +
          searchString,
        {
          headers: getHeaders(),
        }
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
