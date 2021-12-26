import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { UsersService } from 'src/app/services/users.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateCustomerDTO } from 'src/dtos/create-customer.dto';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Company } from 'src/models/company.model';
import { Level1Address } from 'src/models/level1-address.model';
import { Level2Address } from 'src/models/level2-address.model';
import { Level3Address } from 'src/models/level3-address.model';
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.css'],
})
export class CreateCustomerComponent implements OnInit {
  @ViewChild('detailsElement') detailsElement;
  @ViewChild('addressElement') addressElement;
  @ViewChild('planElement') planElement;

  currentCompany: Company;
  isLoading: boolean = true;
  isStoreLoading: boolean = false;
  plans: Plan[] = [];
  collectors: User[] = [];
  loadingGif: string = loadingGifUrl;
  data: CreateCustomerDTO = {
    name: null,
    email: null,
    phoneNumber: null,
    address_id: null,
    collector_id: null,
    plans: [],
    company_id: null,
  };

  detailsIsOpen: boolean = false;
  addressIsOpen: boolean = false;
  plansIsOpen: boolean = false;

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
  selectedLevel5Id: string = null;
  selectedLevel4Id: string = null;
  selectedLevel3Id: string = null;
  selectedLevel2Id: string = null;

  dropdownList = [];
  selectedPlans = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private plansService: PlansService,
    private alertService: AlertService,
    private addressesService: AddressesService
  ) {
    this.isLoading = this.loadingService.appLoading(true);
  }

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService.getCurrentCompany().subscribe(
      (res: Company) => {
        this.currentCompany = res;
        this.companiesService
          .getCompanyEmployees(this.currentCompany.id)
          .subscribe(
            (res: any) => {
              this.collectors = res;
              this.plansService.getActiveCompanyPlans().subscribe(
                async (res: any) => {
                  this.plans = res;
                  this.dropdownList = this.plans;
                  this.companiesService.getCompanyEmployees;
                  this.selectedPlans = [];
                  this.dropdownSettings = {
                    singleSelection: false,
                    idField: 'id',
                    textField: 'name',
                    selectAllText: 'Select All',
                    unSelectAllText: 'UnSelect All',
                    itemsShowLimit: 2,
                    limitSelection: 2,
                    allowSearchFilter: true,
                  };
                  switch (this.currentCompany.maxLocationLevel) {
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
                      this.level4Addresses =
                        await this.addressesService.GetLevel3Addresses();
                      break;
                    case AddressesLevel.LEVEL2:
                      this.isLevel5Allowed = false;
                      this.isLevel4Allowed = false;
                      this.isLevel3Allowed = false;
                      this.isLevel2Allowed = true;
                      this.level4Addresses =
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
                  this.isLoading = this.loadingService.appLoading(false);
                },
                (err) => {
                  this.authService.handleHttpError(err);
                }
              );
            },
            (err) => {
              this.authService.handleHttpError(err);
            }
          );
      },
      (err) => {
        this.authService.handleHttpError(err);
      }
    );
  }

  detailsClicked() {
    setTimeout(() => {
      if (this.detailsElement.nativeElement.open) {
        this.detailsIsOpen = true;
        this.addressIsOpen = false;
        this.plansIsOpen = false;
        this.addressElement.nativeElement.open = false;
        this.planElement.nativeElement.open = false;
      } else {
        this.detailsIsOpen = false;
      }
    }, 0);
  }
  addressClicked() {
    setTimeout(() => {
      if (this.addressElement.nativeElement.open) {
        this.detailsIsOpen = false;
        this.addressIsOpen = true;
        this.plansIsOpen = false;
        this.detailsElement.nativeElement.open = false;
        this.planElement.nativeElement.open = false;
      } else {
        this.addressIsOpen = false;
      }
    }, 0);
  }
  planClicked() {
    setTimeout(() => {
      if (this.planElement.nativeElement.open) {
        this.detailsIsOpen = false;
        this.addressIsOpen = false;
        this.plansIsOpen = true;
        this.addressElement.nativeElement.open = false;
        this.detailsElement.nativeElement.open = false;
      } else {
        this.plansIsOpen = false;
      }
    }, 0);
  }

  store() {
    this.isStoreLoading = true;
    if (!this.data.name) {
      this.alertService.toastError('Customer name should be provided');
      this.isStoreLoading = false;
      return;
    }

    if (!this.data.address_id) {
      this.alertService.toastError('Address should be provided');
      this.isStoreLoading = false;
      return;
    }

    if (this.selectedPlans.length == 0) {
      this.alertService.toastError(
        'You should select a plan for your customer!'
      );
      this.isStoreLoading = false;
      return;
    }
    if (this.selectedPlans.length > 2) {
      this.alertService.toastError('Selected plans should not exceed 2 plans!');
      this.isStoreLoading = false;
      return;
    }

    if (
      !this.data.collector_id &&
      this.authService.currentUser.role != UserRoles.ADMIN
    ) {
      this.data.collector_id = this.authService.currentUser.id;
    }

    if (
      !this.data.collector_id &&
      this.authService.currentUser.role == UserRoles.ADMIN
    ) {
      this.alertService.toastError('Collector should be specified!');
      this.isStoreLoading = false;
      return;
    }

    this.data.plans = this.selectedPlans.map((plan) => plan.id);

    this.data.company_id = this.authService.currentUser.company_id;

    this.companiesService.storeCustomer(this.data).subscribe(
      (res) => {
        this.data = {
          name: null,
          email: null,
          phoneNumber: null,
          address_id: null,
          collector_id: null,
          plans: [],
          company_id: null,
        };
        this.selectedPlans = [];
        this.alertService.toastSuccess('Customer created successfully');
        this.isStoreLoading = false;
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isStoreLoading = false;
      }
    );
  }

  async level5Selected() {
    try {
      this.level4Addresses = await this.addressesService.getLevel5Children(
        this.selectedLevel5Id
      );
      this.level3Addresses = [];
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.data.address_id = null;
      this.selectedLevel4Id = null;
      this.selectedLevel3Id = null;
      this.selectedLevel2Id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level4Selected() {
    try {
      this.level3Addresses = await this.addressesService.getLevel4Children(
        this.selectedLevel4Id
      );
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.data.address_id = null;
      this.selectedLevel3Id = null;
      this.selectedLevel2Id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level3Selected() {
    try {
      this.level2Addresses = await this.addressesService.getLevel3Children(
        this.selectedLevel3Id
      );
      this.data.address_id = null;
      this.selectedLevel2Id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level2Selected() {
    try {
      this.level1Addresses = await this.addressesService.getLevel2Children(
        this.selectedLevel2Id
      );
      this.data.address_id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
