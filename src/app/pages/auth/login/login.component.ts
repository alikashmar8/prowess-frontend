import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogLayoutDisplay } from '@costlydeveloper/ngx-awesome-popup';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { setLang } from 'src/utils/functions';
import { loadingGifUrl } from './../../../../constants/constants';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;
  isLoginLoading: boolean = false;
  loadingGif: string = loadingGifUrl;
  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router,
    public translate: TranslateService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {}

  login() {
    this.isLoginLoading = true;
    if (!this.username) {
      this.alertService.toastNotification(
        'Username should not be empty',
        DialogLayoutDisplay.DANGER
      );
      this.isLoginLoading = false;
      return;
    }
    if (!this.password) {
      this.alertService.toastNotification(
        'Password should not be empty',
        DialogLayoutDisplay.DANGER
      );
      this.isLoginLoading = false;
      return;
    }

    this.authService
      .loginByUsername({
        username: this.username,
        password: this.password,
      })
      .subscribe(
        (results) => {
          if (results.user.isSuperAdmin) {
            //is super admin => redirect to super admin homepage
            this.router.navigate(['admin/home']).then(() => {
              window.location.reload();
              this.isLoginLoading = false;
            });
          } else {
            if (results.user.role != UserRoles.CUSTOMER) {
              // is company employee => redirect to employees homepage
              this.router.navigate(['company/home']).then(() => {
                window.location.reload();
                this.isLoginLoading = false;
              });
            } else {
              // else customer
              // not supported yet
              this.authService.logout();
              window.location.reload();
            }
          }
        },
        (err) => {
          this.authService.handleHttpError(err);
          this.isLoginLoading = false;
        }
      );
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    setLang(lang);
  }
}
