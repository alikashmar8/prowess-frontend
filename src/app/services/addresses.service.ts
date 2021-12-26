import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  addressesLevel1Endpoint,
  addressesLevel2Endpoint,
  addressesLevel3Endpoint,
  addressesLevel4Endpoint,
  addressesLevel5Endpoint
} from 'src/constants/api-constants';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  constructor(private http: HttpClient) {}

  getLevel5AddressById(id: string): any {
    return this.http
      .get(addressesLevel5Endpoint + id, { headers: getHeaders() })
      .toPromise();
  }
  getLevel4AddressById(id: string): any {
    return this.http
      .get(addressesLevel4Endpoint + id, { headers: getHeaders() })
      .toPromise();
  }
  getLevel3AddressById(id: string): any {
    return this.http
      .get(addressesLevel3Endpoint + id, { headers: getHeaders() })
      .toPromise();
  }
  getLevel2AddressById(id: string): any {
    return this.http
      .get(addressesLevel2Endpoint + id, { headers: getHeaders() })
      .toPromise();
  }
  getLevel1AddressById(id: string): any {
    return this.http
      .get(addressesLevel1Endpoint + id, { headers: getHeaders() })
      .toPromise();
  }

  storeLevel5(name: string) {
    return this.http.post(
      addressesLevel5Endpoint,
      { name },
      { headers: getHeaders() }
    );
  }

  storeLevel4(data: { name: string; parent_id?: string }) {
    return this.http.post(addressesLevel4Endpoint, data, {
      headers: getHeaders(),
    });
  }

  storeLevel3(data: { name: string; parent_id?: string }) {
    return this.http.post(addressesLevel3Endpoint, data, {
      headers: getHeaders(),
    });
  }

  storeLevel2(data: { name: string; parent_id?: string }) {
    return this.http.post(addressesLevel2Endpoint, data, {
      headers: getHeaders(),
    });
  }

  storeLevel1(data: { name: string; parent_id?: string }) {
    return this.http.post(addressesLevel1Endpoint, data, {
      headers: getHeaders(),
    });
  }

  GetLevel5Addresses(): Promise<any> {
    return this.http
      .get(addressesLevel5Endpoint, { headers: getHeaders() })
      .toPromise();
  }

  GetLevel4Addresses(): Promise<any> {
    return this.http
      .get(addressesLevel4Endpoint, { headers: getHeaders() })
      .toPromise();
  }

  GetLevel3Addresses(): Promise<any> {
    return this.http
      .get(addressesLevel3Endpoint, { headers: getHeaders() })
      .toPromise();
  }

  GetLevel2Addresses(): Promise<any> {
    return this.http
      .get(addressesLevel2Endpoint, { headers: getHeaders() })
      .toPromise();
  }

  GetLevel1Addresses(): Promise<any> {
    return this.http
      .get(addressesLevel1Endpoint, { headers: getHeaders() })
      .toPromise();
  }

  update(
    id: string,
    data: { name: string; parent_id?: string },
    level: AddressesLevel
  ) {
    const url = this.getLevelUrl(level);
    return this.http.put(url + id, data, { headers: getHeaders() });
  }

  getLevelUrl(level: AddressesLevel) {
    switch (level) {
      case AddressesLevel.LEVEL1:
        return addressesLevel1Endpoint;
      case AddressesLevel.LEVEL2:
        return addressesLevel2Endpoint;
      case AddressesLevel.LEVEL3:
        return addressesLevel3Endpoint;
      case AddressesLevel.LEVEL4:
        return addressesLevel4Endpoint;
      case AddressesLevel.LEVEL5:
        return addressesLevel5Endpoint;
    }
  }

  getLevel5Children(id: string): Promise<any> {
    return this.http
      .get(addressesLevel5Endpoint + id + '/children', {
        headers: getHeaders(),
      })
      .toPromise();
  }
  getLevel4Children(id: string): Promise<any> {
    return this.http
      .get(addressesLevel4Endpoint + id + '/children', {
        headers: getHeaders(),
      })
      .toPromise();
  }
  getLevel3Children(id: string): Promise<any> {
    return this.http
      .get(addressesLevel3Endpoint + id + '/children', {
        headers: getHeaders(),
      })
      .toPromise();
  }
  getLevel2Children(id: string): Promise<any> {
    return this.http
      .get(addressesLevel2Endpoint + id + '/children', {
        headers: getHeaders(),
      })
      .toPromise();
  }
  deleteLevel1Address(id: string) {
    return this.http.delete(addressesLevel1Endpoint + id, {
      headers: getHeaders(),
    });
  }
  deleteLevel2Address(id: string) {
    return this.http.delete(addressesLevel2Endpoint + id, {
      headers: getHeaders(),
    });
  }
  deleteLevel3Address(id: string) {
    return this.http.delete(addressesLevel3Endpoint + id, {
      headers: getHeaders(),
    });
  }
  deleteLevel4Address(id: string) {
    return this.http.delete(addressesLevel4Endpoint + id, {
      headers: getHeaders(),
    });
  }
  deleteLevel5Address(id: string) {
    return this.http.delete(addressesLevel5Endpoint + id, {
      headers: getHeaders(),
    });
  }
}
