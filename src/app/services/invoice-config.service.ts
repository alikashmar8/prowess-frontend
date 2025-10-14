import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InvoiceConfig } from 'src/models/invoice-config.model';
import { getHeaders } from 'src/utils/functions';
import { invoiceConfigsEndpoint } from './../../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class InvoiceConfigsService {
  // private apiUrl = environment.apiUrl + '/invoice-configs';

  constructor(private http: HttpClient) {}

  getById(id: string): Promise<InvoiceConfig> {
    return this.http
      .get<InvoiceConfig>(`${invoiceConfigsEndpoint}${id}`, {
        headers: getHeaders(),
      })
      .toPromise();
  }

  update(
    id: string,
    invoiceConfig: InvoiceConfig
  ): Promise<Observable<InvoiceConfig>> {
    return Promise.resolve(
      this.http.patch<InvoiceConfig>(
        `${invoiceConfigsEndpoint}${id}`,
        invoiceConfig,
        { headers: getHeaders() }
      )
    );
  }
}
