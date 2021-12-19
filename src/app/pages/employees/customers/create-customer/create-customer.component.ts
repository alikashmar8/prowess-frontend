import { Component, OnInit, ViewChild } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { UsersService } from 'src/app/services/users.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateCustomerDTO } from 'src/dtos/create-customer.dto';
import { AddressesEnum } from 'src/enums/addresses.enum';
import { Company } from 'src/models/company.model';
import { Plan } from 'src/models/plan.model';

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
  loadingGif: string = loadingGifUrl;
  data: CreateCustomerDTO = {
    name: null,
    email: null,
    phoneNumber: null,
    address: {
      country: null,
      district: null,
      city: null,
      area: null,
      street: null,
      building: null,
      notes: null,
    },
    plans: [],
    company_id: null,
  };

  detailsIsOpen: boolean = false;
  addressIsOpen: boolean = false;
  plansIsOpen: boolean = false;

  isCountryAllowed: boolean = false;
  isDistrictAllowed: boolean = false;
  isCityAllowed: boolean = false;
  isAreaAllowed: boolean = false;
  isStreetAllowed: boolean = false;
  isBuildingAllowed: boolean = false;

  dropdownList = [];
  selectedPlans = [];
  dropdownSettings: IDropdownSettings = {};

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private plansService: PlansService,
    private alertService: AlertService,
    private usersService: UsersService
  ) {
    this.isLoading = this.loadingService.appLoading(true);
  }

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService.getCurrentCompany().subscribe(
      (res: Company) => {
        this.currentCompany = res;
        this.handleAddresses(this.currentCompany.maxLocationToEnter);
        this.plansService.getActiveCompanyPlans().subscribe(
          (res: any) => {
            this.plans = res;
            this.dropdownList = this.plans;
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

  handleAddresses(maxAddressToShow: AddressesEnum) {
    switch (maxAddressToShow) {
      case AddressesEnum.COUNTRY:
        this.isCountryAllowed = true;
        this.isDistrictAllowed = true;
        this.isCityAllowed = true;
        this.isAreaAllowed = true;
        this.isStreetAllowed = true;
        this.isBuildingAllowed = true;
        break;

      case AddressesEnum.DISTRICT:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = true;
        this.isCityAllowed = true;
        this.isAreaAllowed = true;
        this.isStreetAllowed = true;
        this.isBuildingAllowed = true;
        break;

      case AddressesEnum.CITY:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = false;
        this.isCityAllowed = true;
        this.isAreaAllowed = true;
        this.isStreetAllowed = true;
        this.isBuildingAllowed = true;
        break;

      case AddressesEnum.AREA:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = false;
        this.isCityAllowed = false;
        this.isAreaAllowed = true;
        this.isStreetAllowed = true;
        this.isBuildingAllowed = true;
        break;

      case AddressesEnum.STREET:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = false;
        this.isCityAllowed = false;
        this.isAreaAllowed = false;
        this.isStreetAllowed = true;
        this.isBuildingAllowed = true;
        break;

      case AddressesEnum.BUILDING:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = false;
        this.isCityAllowed = false;
        this.isAreaAllowed = false;
        this.isStreetAllowed = false;
        this.isBuildingAllowed = true;
        break;

      default:
        this.isCountryAllowed = false;
        this.isDistrictAllowed = false;
        this.isCityAllowed = false;
        this.isAreaAllowed = false;
        this.isStreetAllowed = false;
        this.isBuildingAllowed = false;
        break;
    }
  }

  store() {
    this.isStoreLoading = true;
    if (!this.data.name) {
      this.alertService.toastError('Customer name should be provided');
      this.isStoreLoading = false;
      return;
    }

    // TODO: check address validation

    if (this.selectedPlans.length == 0) {
      this.alertService.toastError(
        'You should select a plan for your customer!'
      );
      this.isStoreLoading = false;
      return;
    }
    if (this.selectedPlans.length > 2) {
      0;
      this.alertService.toastError('Selected plans should not exceed 2 plans!');
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
          address: {
            country: null,
            district: null,
            city: null,
            area: null,
            street: null,
            building: null,
            notes: null,
          },
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
}
