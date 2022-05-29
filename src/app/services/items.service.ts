import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { itemsEndpoint } from 'src/constants/api-constants';
import { CreateItemDTO } from 'src/dtos/create-item.dto';
import { Item } from 'src/models/item.model';
import { getHeaders } from 'src/utils/functions';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCompanyItems(company_id: string) {
    return this.http.get(itemsEndpoint + 'company/' + company_id, {
      headers: getHeaders(),
    });
  }
  store(data: CreateItemDTO) {
    return this.http.post(itemsEndpoint, data, { headers: getHeaders() });
  }

  async update(item: Item) {
    return await this.http
      .put(itemsEndpoint + item.id, item, { headers: getHeaders() })
      .toPromise();
  }

  updateStatus(id: string, status: boolean) {
    return this.http.put(
      itemsEndpoint + id + '/status',
      { isActive: status },
      { headers: getHeaders() }
    );
  }
}
