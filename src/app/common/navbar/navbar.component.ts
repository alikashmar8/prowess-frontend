import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showUsers: boolean = false;
  showInvoices: boolean = false;
  showAddresses: boolean = false;
  showTasks: boolean = false;
  currentUser: User;
  UserRole = UserRoles;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
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

  toggleTasks() {
    this.showTasks = !this.showTasks;
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
