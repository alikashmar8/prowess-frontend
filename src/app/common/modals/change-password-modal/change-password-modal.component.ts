import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';

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

  submittedAction: any;

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // if (this.authService.currentUser.id != this.user.id) {
    //   this.alertService.error('You are not allowed to change this password.');
    //   this.activeModal.dismiss();
    // }
    // specify action to be submitted when the form is submitted:
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

      if (
        this.authService.currentUser.role == UserRoles.ADMIN &&
        this.authService.currentUser.id != this.user.id
      ) {
        await this.authService.adminUpdateEmployeePassword(this.user.id, {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
        });
      } else {
        await this.authService.updatePassword(this.user.id, {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
        });
      }

      this.alertService.toastSuccess('Password updated successfully.');
      this.activeModal.close();
    } catch (err) {
      this.authService.handleHttpError(err);
    } finally {
      this.isUpdateLoading = false;
    }
  }
}
