import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivateCustomerModal } from 'src/app/common/modals/activate-customer-modal/activate-customer-modal.component';
import { EnableDisableUserComponent } from 'src/app/common/modals/enable-disable-user/enable-disable-user.component';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { UsersService } from 'src/app/services/users.service';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { Level1Address } from 'src/models/level1-address.model';
import { Level2Address } from 'src/models/level2-address.model';
import { Level3Address } from 'src/models/level3-address.model';
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';
import { getAddressString } from 'src/utils/functions';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  currentUser: User;
  customers: User[] = [];
  isLoading: boolean = true;

  take: number = 10;
  skip: number = 0;

  totalPages: number = 0;
  totalRecords: number = 0;
  currentPage: number = 1;

  isFiltersDisplayed: boolean = false;

  level5Addresses: Level5Address[] = [];
  level4Addresses: Level4Address[] = [];
  level3Addresses: Level3Address[] = [];
  level2Addresses: Level2Address[] = [];
  level1Addresses: Level1Address[] = [];
  isLevel5Allowed: boolean = false;
  isLevel4Allowed: boolean = false;
  isLevel3Allowed: boolean = false;
  isLevel2Allowed: boolean = false;
  isLevel1Allowed: boolean = true;

  plans: Plan[] = [];
  employees: User[] = [];

  filters = {
    search: null,
    planId: null,
    employeeId: null,
    level5Address: null,
    level4Address: null,
    level3Address: null,
    level2Address: null,
    level1Address: null,
    orderBy: null,
    startDate: null,
    endDate: null,
  };

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private usersService: UsersService,
    private addressesService: AddressesService,
    private plansService: PlansService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    try {
      this.currentUser = this.authService.currentUser;
      switch (this.currentUser.company.maxLocationLevel) {
        case AddressesLevel.LEVEL5:
          this.isLevel5Allowed = true;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level5Addresses =
            await this.addressesService.GetLevel5Addresses();
          break;
        case AddressesLevel.LEVEL4:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level4Addresses =
            await this.addressesService.GetLevel4Addresses();
          break;
        case AddressesLevel.LEVEL3:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level3Addresses =
            await this.addressesService.GetLevel3Addresses();
          break;
        case AddressesLevel.LEVEL2:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = true;
          this.level2Addresses =
            await this.addressesService.GetLevel2Addresses();
          break;
        case AddressesLevel.LEVEL1:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = false;
          this.level1Addresses =
            await this.addressesService.GetLevel1Addresses();
          break;
      }
    } catch (e) {
      this.authService.handleHttpError(e);
    }
    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        this.skip
      )
      .subscribe(
        (result: any) => {
          this.customers = result.data;
          this.totalRecords = result.count;
          this.totalPages = result.count > 0 ? Math.ceil(result.count / 10) : 1;
          this.plansService
            .getCompanyPlans(this.currentUser.company.id)
            .subscribe((plans: any[]) => {
              this.plans = plans;
            });
          this.companiesService
            .getCompanyEmployees(this.currentUser.company_id)
            .subscribe(
              (result: any) => {
                this.employees = result;
              },
              (error) => {
                this.authService.handleHttpError(error);
              }
            );
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
    if (page == this.currentPage && page != 1) return;

    this.isLoading = this.loadingService.appLoading(true);

    this.customers = [];
    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        (page - 1) * this.take,
        this.filters
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
    if (isActive) {
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
    } else {
      const modalRef = this.modalService.open(ActivateCustomerModal);
      modalRef.componentInstance.customer_id = id;
      modalRef.componentInstance.userName = userName;
      modalRef.result.then((result) => {
        if (result) {
          window.location.reload();
        }
      });
    }
  }

  searchCustomers() {
    this.isLoading = this.loadingService.appLoading(true);
    this.customers = [];
    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        this.skip,
        this.filters
      )
      .subscribe(
        (result: any) => {
          this.customers = result.data;
          this.totalRecords = result.count;
          this.totalPages = result.count > 0 ? Math.ceil(result.count / 10) : 1;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.alertService.toastError('Error fetching results');
        }
      );
  }

  showHideFilters() {
    this.isFiltersDisplayed = !this.isFiltersDisplayed;
  }

  async level5Selected() {
    try {
      this.level4Addresses = await this.addressesService.getLevel5Children(
        this.filters.level5Address
      );
      this.level3Addresses = [];
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.filters.level4Address = null;
      this.filters.level3Address = null;
      this.filters.level2Address = null;
      this.filters.level1Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level4Selected() {
    try {
      this.level3Addresses = await this.addressesService.getLevel4Children(
        this.filters.level4Address
      );
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.filters.level3Address = null;
      this.filters.level2Address = null;
      this.filters.level1Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level3Selected() {
    try {
      this.level2Addresses = await this.addressesService.getLevel3Children(
        this.filters.level3Address
      );
      this.filters.level2Address = null;
      this.filters.level1Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level2Selected() {
    try {
      this.level1Addresses = await this.addressesService.getLevel2Children(
        this.filters.level2Address
      );
      this.filters.level1Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async sortCustomers(value) {
    if (this.filters.orderBy && this.filters.orderBy == value)
      this.filters.orderBy = '-' + value;
    else this.filters.orderBy = value;

    this.getPageRecords(1);
  }
}
