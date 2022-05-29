import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { getLang, setLang } from 'src/utils/functions';

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
  UserRole = UserRoles;

  constructor(
    private authService: AuthService,
    private router: Router,
    public translate: TranslateService
  ) {
    var storedLang: string = getLang();
    if (storedLang !== '') {
      translate.use(storedLang);
    } else {
      translate.use('en');
      setLang('en');
    }
  }

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
