import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getHeaders } from 'src/utils/functions';
import { receivedAmountsEndpoint } from './../../constants/api-constants';
import { firstValueFrom } from 'rxjs';
import { ReceivedAmount } from 'src/models/received-amount';

@Injectable({
  providedIn: 'root',
})
export class ReceivedAmountsService {
  async getAll(data: {
    take: number;
    skip: number;
    fromDate: Date;
    toDate: Date;
  }): Promise<{
    data?: ReceivedAmount[];
    count?: number;
  }> {
    return await firstValueFrom(
      this.http.get(
        receivedAmountsEndpoint +
          `?take=${data.take}&skip=${data.skip}&fromDate=${data.fromDate}&toDate=${data.toDate}`,
        { headers: getHeaders() }
      )
    );
    // .toPromise();
  }
  constructor(private http: HttpClient) {}

  store(data) {
    return this.http.post(receivedAmountsEndpoint, data, {
      headers: getHeaders(),
    });
  }
}
