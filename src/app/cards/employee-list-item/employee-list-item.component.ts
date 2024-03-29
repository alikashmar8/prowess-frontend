import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from 'src/app/common/modals/delete-modal/delete-modal.component';
import { RenewUserModalComponent } from 'src/app/common/modals/renew-user-modal/renew-user-modal.component';
import { ShowEmployeeModal } from 'src/app/common/modals/show-employee-modal/show-employee-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { UsersService } from 'src/app/services/users.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { InputType } from './../../../enums/input-type.enum';
import { User } from './../../../models/user.model';

@Component({
  selector: 'app-employee-list-item',
  templateUrl: './employee-list-item.component.html',
  styleUrls: ['./employee-list-item.component.css'],
})
export class EmployeeListItemComponent implements OnInit {
  @Input() employee: User;

  isActive: boolean = true;
  InputType = InputType;

  constructor(
    private modalService: NgbModal,
    private companiesService: CompaniesService,
    private alertService: AlertService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    const expiryDate = new Date(this.employee.expiryDate);
    const today = new Date();
    this.isActive = expiryDate > today;
  }

  openRenewModal() {
    const modalRef = this.modalService.open(RenewUserModalComponent);
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

  openDeleteModal(employeeId: string, employeeName: string) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.name = employeeName;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.companiesService.deleteEmployee(employeeId).subscribe(
            (result: any) => {
              if (result.affected > 0) {
                this.alertService.toastSuccess('Employee deleted successfully');
                window.location.reload();
              } else {
                this.alertService.toastError('Error deleting company');
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

  openDetailModal(employee) {
    const modalRef = this.modalService.open(ShowEmployeeModal, { size: 'lg' });
    modalRef.componentInstance.employee = this.employee;
  }

  async openRoleEdit(fieldName: string, type: InputType) {
    const newValue = await this.alertService.dynamicInputDialog({
      label: 'Note that your balance will be affected accordingly',
      inputType: InputType.SELECT,
      value: this.employee.role,
      options: [
        { label: 'Manager', value: UserRoles.MANAGER },
        { label: 'Supervisor', value: UserRoles.SUPERVISOR },
        { label: 'Collector', value: UserRoles.COLLECTOR },
      ],
    });
    if (newValue && newValue != this.employee.role) {
      this.usersService
        .updateRole(this.employee.id, {
          newRole: newValue,
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
}
