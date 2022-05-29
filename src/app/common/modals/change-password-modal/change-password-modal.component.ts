import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { User } from 'src/models/user.model';
import { getLang, setLang } from 'src/utils/functions';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css'],
})
export class ChangePasswordModal implements OnInit {
  @Input() user: User;
  isUpdateLoading: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal,
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
    if (this.authService.currentUser.id != this.user.id) {
      this.alertService.error('You are not allowed to change this password.');
      this.activeModal.dismiss();
    }
  }

  async update() {
    try {
      this.isUpdateLoading = true;
      if (!this.oldPassword || !this.confirmPassword || !this.newPassword) {
        this.alertService.toastError('Please fill all the fields.');
        this.isUpdateLoading = false;
        return;
      }

      if (this.newPassword != this.confirmPassword) {
        this.alertService.toastError('Passwords do not match.');
        this.isUpdateLoading = false;
        return;
      }

      await this.authService.updatePassword(this.user.id, {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
        confirmPassword: this.confirmPassword,
      });
      this.alertService.success('Password updated successfully.');
      this.activeModal.close();
    } catch (err) {
      this.authService.handleHttpError(err);
    } finally {
      this.isUpdateLoading = false;
    }
  }
}
