import { User } from 'src/models/user.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class SuperAdminGuard implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    // const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    // decode the token to get its payload
    const tokenPayload: any = decode(token);

    if (!this.auth.isAuthenticated() || !tokenPayload.user.isSuperAdmin) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
