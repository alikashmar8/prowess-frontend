import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invoicesEndpoint } from 'src/constants/api-constants';
import { CreateInvoiceDTO } from 'src/dtos/create-invoice.dto';
import { InvoiceTypes } from 'src/enums/invoices-type.enum';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';
import { ListInvoicesParams } from 'src/interfaces/invoices.interfaces';

@Injectable({
  providedIn: 'root',
})
export class InvoicesService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  async listInvoices(data?: ListInvoicesParams): Promise<any> {
    let queryParams = this.constructListInvoicesParams(data);
    return await this.http
      .get(invoicesEndpoint + queryParams, {
        headers: getHeaders(),
      })
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

  // downloadUnpaidInvoicesExcel() {
  //   return this.http.get(invoicesEndpoint + 'reports/excel/unpaid/', {
  //     headers: getHeaders(),
  //     responseType: 'blob',
  //   });
  // }

  downloadInvoicesExcel(params: ListInvoicesParams) {
    const queryParams = this.constructListInvoicesParams(params);

    return this.http.get(invoicesEndpoint + 'reports/excel/' + queryParams, {
      headers: getHeaders(),
      responseType: 'blob',
    });
  }

  // downloadPaidInvoicesExcel() {
  //   return this.http.get(invoicesEndpoint + 'reports/excel/paid/', {
  //     headers: getHeaders(),
  //     responseType: 'blob',
  //   });
  // }

  // downloadInvoicesExcelByMonth(date) {
  //   return this.http.get(
  //     invoicesEndpoint + 'reports/excel/by-month/?date=' + date,
  //     {
  //       headers: getHeaders(),
  //       responseType: 'blob',
  //     }
  //   );
  // }

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

  constructListInvoicesParams(data: ListInvoicesParams): string {
    const type = data?.type || InvoiceTypes.PLANS_INVOICE;
    let searchString = '?type=' + type;
    if (data?.search) {
      searchString += `&search=${data.search}`;
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
    if (data?.skip) {
      searchString = `${searchString}&skip=${data.skip}`;
    }
    if (data?.level1Address) {
      searchString = `${searchString}&level1Address=${data.level1Address}`;
    }
    if (data?.level2Address) {
      searchString = `${searchString}&level2Address=${data.level2Address}`;
    }
    if (data?.level3Address) {
      searchString = `${searchString}&level3Address=${data.level3Address}`;
    }
    if (data?.level4Address) {
      searchString = `${searchString}&level4Address=${data.level4Address}`;
    }
    if (data?.level5Address) {
      searchString = `${searchString}&level5Address=${data.level5Address}`;
    }
    return searchString;
  }
}
