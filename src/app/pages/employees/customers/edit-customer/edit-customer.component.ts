import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css'],
})
export class EditCustomerComponent implements OnInit {
  @ViewChild('detailsElement') detailsElement;
  @ViewChild('addressElement') addressElement;
  @ViewChild('planElement') planElement;

  currentCompany: Company;
  user_id: string;
  user: User;
  isLoading: boolean = true;
  isUpdateLoading: boolean = false;
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
    private usersService: UsersService,
    private route: ActivatedRoute
  ) {
    this.isLoading = this.loadingService.appLoading(true);
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    this.user_id = this.route.snapshot.paramMap.get('id');
    try {
      this.user = await this.companiesService.getCustomerById(this.user_id);
    } catch (err) {
      this.authService.handleHttpError(err);
    }
    this.companiesService.getCurrentCompany().subscribe(
      (res: Company) => {
        this.currentCompany = res;
        this.handleAddresses(this.currentCompany.maxLocationToEnter);
        this.plansService.getActiveCompanyPlans().subscribe(
          (res: any) => {
            this.plans = res;
            this.dropdownList = this.plans;
            this.user.plans.forEach((plan) => {
              this.selectedPlans.push({
                id: plan.id,
                name: plan.name,
              });
            });
            console.log(this.dropdownList);

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
            this.data = {
              name: this.user.name,
              email: this.user.email,
              phoneNumber: this.user.phoneNumber,
              address: {
                id: this.user.address_id,
                country: this.user.address.country,
                district: this.user.address.district,
                city: this.user.address.city,
                area: this.user.address.area,
                street: this.user.address.street,
                building: this.user.address.building,
                notes: this.user.address.notes,
              },
              plans: this.user.plans.map((plan) => plan.id),
              company_id: this.user.company_id,
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

  update() {
    this.isUpdateLoading = true;
    if (!this.data.name) {
      this.alertService.toastError('Customer name should be provided');
      this.isUpdateLoading = false;
      return;
    }

    // TODO: check address validation

    if (this.selectedPlans.length == 0) {
      this.alertService.toastError(
        'You should select a plan for your customer!'
      );
      this.isUpdateLoading = false;
      return;
    }
    if (this.selectedPlans.length > 2) {
      0;
      this.alertService.toastError('Selected plans should not exceed 2 plans!');
      this.isUpdateLoading = false;
      return;
    }

    this.data.plans = this.selectedPlans.map((plan) => plan.id);

    this.companiesService.updateCustomer(this.user_id, this.data).subscribe(
      (res) => {
        this.alertService.toastSuccess('Customer updated successfully');
        this.isUpdateLoading = false;
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isUpdateLoading = false;
      }
    );
  }
}
