import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnableDisableUserComponent } from 'src/app/common/modals/enable-disable-user/enable-disable-user.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/models/user.model';
import { getAddressString } from 'src/utils/functions';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  customers: User[] = [];
  isLoading: boolean = true;
  search: string;

  take: number = 10;
  skip: number = 0;

  totalPages: number = 0;
  totalRecords: number = 0;
  currentPage: number = 1;

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        this.skip
      )
      .subscribe(
        (result: any) => {
          this.customers = result.data;
          console.log(this.customers);
          this.totalRecords = result.count;
          this.totalPages = result.count > 0 ? Math.ceil(result.count / 10) : 1;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }

  getAddressString(address) {
    return getAddressString(address);
  }

  counter(i: number) {
    return new Array(i);
  }

  getPageRecords(page: number) {
    if (page == this.currentPage) return;

    this.isLoading = this.loadingService.appLoading(true);

    this.customers = [];
    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        (page - 1) * this.take
      )
      .subscribe(
        (result: any) => {
          this.customers = result.data;
          this.totalPages = result.count > 0 ? Math.ceil(result.count / 10) : 1;
          this.currentPage = page;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }

  openEnableDisableModal(id: string, userName: string, isActive: boolean) {
    const modalRef = this.modalService.open(EnableDisableUserComponent);
    modalRef.componentInstance.userName = userName;
    modalRef.componentInstance.isActive = isActive;
    modalRef.result.then(
      (result) => {
        if (result) {
          isActive
            ? this.usersService.makeUserInactive(id).subscribe(
                (result: any) => {
                  if (result.affected > 0) {
                    this.alertService.toastSuccess('Operation successful');
                    window.location.reload();
                  } else {
                    this.alertService.toastError('Error');
                  }
                },
                (error) => {
                  this.authService.handleHttpError(error);
                }
              )
            : this.usersService.makeUserActive(id).subscribe(
                (result: any) => {
                  if (result.affected > 0) {
                    this.alertService.toastSuccess('Operation successful');
                    window.location.reload();
                  } else {
                    this.alertService.toastError('Error');
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
