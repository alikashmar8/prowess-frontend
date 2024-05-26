import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { InputType } from 'src/enums/input-type.enum';
import { User } from 'src/models/user.model';
import { ChangePasswordModal } from '../change-password-modal/change-password-modal.component';
import { RenewUserModalComponent } from '../renew-user-modal/renew-user-modal.component';
import { CompaniesService } from './../../../services/companies.service';
import { UsersService } from './../../../services/users.service';

@Component({
  selector: 'app-show-employee-modal',
  templateUrl: './show-employee-modal.component.html',
  styleUrls: ['./show-employee-modal.component.css'],
})
export class ShowEmployeeModal implements OnInit {
  @Input() employee: User;
  InputType = InputType;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private usersService: UsersService,
    private authService: AuthService,
    private ngbModal: NgbModal,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {}

  async openFieldEdit(fieldName: string, type: InputType) {
    const newValue = await this.alertService.dynamicInputDialog({
      inputType: type,
      value: this.employee[fieldName],
    });
    if (newValue && newValue != this.employee[fieldName]) {
      this.usersService
        .update(this.employee.id, {
          [fieldName]: newValue,
        })
        .subscribe(
          (res) => {
            this.alertService.toastSuccess('Employee updated successfully!');
            window.location.reload();
          },
          (err) => {
            this.authService.handleHttpError(err);
          }
        );
    }
  }

  openChangePasswordModal() {
    const modalRef = this.ngbModal.open(ChangePasswordModal, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.user = this.employee;

    modalRef.result.then((result) => {});
  }

  openRenewModal() {
    const modalRef = this.ngbModal.open(RenewUserModalComponent);
    modalRef.componentInstance.userRole = this.employee.role;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.companiesService.renewEmployee(this.employee.id).subscribe(
            (result: any) => {
              if (result) {
                this.alertService.toastSuccess('User renewed successfully');
                window.location.reload();
              } else {
                this.alertService.toastError('Error renewing user');
              }
            },
            (error) => {
              this.authService.handleHttpError(error);
            }
          );
        }
      },
      (rejected) => {}
    );
  }
}
