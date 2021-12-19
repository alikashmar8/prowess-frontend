import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usersEndpoint } from 'src/constants/api-constants';
import { User } from 'src/models/user.model';
import { getHeaders } from 'src/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  makeUserActive(id: string) {
    return this.http.put(
      usersEndpoint + `${id}/make-active`,
      {},
      { headers: getHeaders() }
    );
  }

  makeUserInactive(id: string) {
    return this.http.put(
      usersEndpoint + `${id}/make-inactive`,
      {},
      { headers: getHeaders() }
    );
  }

  getUserById(id: string): Promise<any> {
    return this.http.get(usersEndpoint + `${id}`, { headers: getHeaders() }).toPromise();;
  }
}
