import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showUsers = false;
  showInvoices = false;
  showAddresses = false;
  currentUser: User;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    console.log(this.currentUser);

  }

  toggleUsers() {
    this.showUsers = !this.showUsers;
  }

  toggleInvoices() {
    this.showInvoices = !this.showInvoices;
  }

  toggleAddresses() {
    this.showAddresses = !this.showAddresses;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  isCurrentRoute(param: string) {
    return param == this.router.url;
  }
}
