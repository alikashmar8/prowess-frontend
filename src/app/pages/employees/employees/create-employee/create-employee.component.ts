import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateEmployeeDTO } from 'src/dtos/create-employee.dto';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { getEnumArray } from 'src/utils/functions';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css'],
})
export class CreateEmployeeComponent implements OnInit {
  currentUser: User;
  nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1));

  employee: CreateEmployeeDTO = {
    name: null,
    password: null,
    company_id: null,
    role: null,
    username: null,
    email: null,
    phoneNumber: null,
    expiryDate: this.nextMonth,
  };

  isStoreLoading: boolean = false;
  loadingGif: string = loadingGifUrl;
  userRoles: string[] = getEnumArray(UserRoles).filter((role) => {
    if (role != UserRoles.ADMIN && role != UserRoles.CUSTOMER) return role;
  });

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.employee.role = this.userRoles[0];
    this.employee.company_id = this.authService.currentUser.company.id;
  }

  store() {
    this.isStoreLoading = true;
    if (!this.employee.name) {
      this.alertService.toastError('Employee name should not be empty');
      this.isStoreLoading = false;
      return;
    }

    if (!this.employee.username) {
      this.alertService.toastError('Employee username should not be empty');
      this.isStoreLoading = false;
      return;
    }

    if (!this.employee.password) {
      this.alertService.toastError('Employee password should not be empty');
      this.isStoreLoading = false;
      return;
    }

    if (!this.employee.role) {
      this.alertService.toastError('Employee role should not be empty');
      this.isStoreLoading = false;
      return;
    }

    let amountToDeduct = 0;
    switch (this.employee.role) {
      case UserRoles.MANAGER:
        amountToDeduct =
          this.authService.currentUser.company.managerAccountPrice;
        break;
      case UserRoles.SUPERVISOR:
        amountToDeduct =
          this.authService.currentUser.company.supervisorAccountPrice;
        break;
      case UserRoles.COLLECTOR:
        amountToDeduct =
          this.authService.currentUser.company.collectorAccountPrice;
        break;
    }

    let accepted = confirm(
      amountToDeduct +
        ` ${this.currentUser.company.currencySymbol} will be deducted from your account`
    );

    if (!accepted) {
      this.isStoreLoading = false;
      this.alertService.toastError('Employee creation cancelled');
      return;
    }

    this.companiesService.storeEmployee(this.employee).subscribe(
      (res) => {
        this.alertService.toastSuccess('Employee Added Successfully');
        this.isStoreLoading = false;
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isStoreLoading = false;
      }
    );
  }
}
