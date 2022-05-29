import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from 'src/constants/api-constants';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  async getStats(): Promise<any> {
    return await this.http
      .get(apiUrl + 'stats', { headers: getHeaders() })
      .toPromise();
  }
}
