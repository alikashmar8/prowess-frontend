import { UserRoles } from './../../../../../enums/user-roles.enum';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateCustomerDTO } from 'src/dtos/create-customer.dto';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { Company } from 'src/models/company.model';
import { Level1Address } from 'src/models/level1-address.model';
import { Level2Address } from 'src/models/level2-address.model';
import { Level3Address } from 'src/models/level3-address.model';
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
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
  collectors: User[] = [];
  loadingGif: string = loadingGifUrl;
  data: CreateCustomerDTO = {
    name: null,
    email: null,
    phoneNumber: null,
    address_id: null,
    plans: [],
    collector_id: null,
    company_id: null,
    paymentDate: null,
    invoice_total: null,
    invoice_notes: null,
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
    private route: ActivatedRoute,
    private addressesService: AddressesService
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
        this.companiesService
          .getCompanyEmployees(this.currentCompany.id)
          .subscribe(
            (res: any) => {
              this.collectors = res.filter((collector) => {
                if (collector.role != UserRoles.ADMIN) return collector;
              });
              this.plansService.getActiveCompanyPlans().subscribe(
                async (res: any) => {
                  this.plans = res;
                  this.dropdownList = this.plans;
                  this.user.plans.forEach((plan) => {
                    this.selectedPlans.push({
                      id: plan.id,
                      name: plan.name,
                    });
                  });
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
                    address_id: this.user.address_id,
                    collector_id: this.user.collector.id,
                    plans: this.user.plans.map((plan) => plan.id),
                    company_id: this.user.company_id,
                    paymentDate: this.user.paymentDate
                      ? new Date(this.user.paymentDate)
                          .toISOString()
                          .split('T')[0]
                      : null,
                    invoice_total: null,
                    invoice_notes: null,
                  };
                  switch (this.currentCompany.maxLocationLevel) {
                    case AddressesLevel.LEVEL5:
                      this.isLevel5Allowed = true;
                      this.isLevel4Allowed = true;
                      this.isLevel3Allowed = true;
                      this.isLevel2Allowed = true;
                      this.level5Addresses =
                        await this.addressesService.GetLevel5Addresses();

                      this.selectedLevel5Id =
                        this.user.address.parent.parent.parent.parent.id;
                      await this.level5Selected();
                      this.selectedLevel4Id =
                        this.user.address.parent.parent.parent.id;
                      await this.level4Selected();
                      this.selectedLevel3Id =
                        this.user.address.parent.parent.id;
                      await this.level3Selected();
                      this.selectedLevel2Id = this.user.address.parent.id;
                      await this.level2Selected();
                      this.data.address_id = this.user.address.id;
                      break;
                    case AddressesLevel.LEVEL4:
                      this.isLevel5Allowed = false;
                      this.isLevel4Allowed = true;
                      this.isLevel3Allowed = true;
                      this.isLevel2Allowed = true;
                      this.level4Addresses =
                        await this.addressesService.GetLevel4Addresses();
                      this.selectedLevel4Id =
                        this.user.address.parent.parent.parent.id;
                      await this.level4Selected();
                      this.selectedLevel3Id =
                        this.user.address.parent.parent.id;
                      await this.level3Selected();
                      this.selectedLevel2Id = this.user.address.parent.id;
                      await this.level2Selected();
                      this.data.address_id = this.user.address.id;
                      break;
                    case AddressesLevel.LEVEL3:
                      this.isLevel5Allowed = false;
                      this.isLevel4Allowed = false;
                      this.isLevel3Allowed = true;
                      this.isLevel2Allowed = true;
                      this.level4Addresses =
                        await this.addressesService.GetLevel3Addresses();

                      this.selectedLevel3Id =
                        this.user.address.parent.parent.id;
                      await this.level3Selected();
                      this.selectedLevel2Id = this.user.address.parent.id;
                      await this.level2Selected();
                      this.data.address_id = this.user.address.id;
                      break;
                    case AddressesLevel.LEVEL2:
                      this.isLevel5Allowed = false;
                      this.isLevel4Allowed = false;
                      this.isLevel3Allowed = false;
                      this.isLevel2Allowed = true;
                      this.level2Addresses =
                        await this.addressesService.GetLevel2Addresses();

                      this.selectedLevel2Id = this.user.address.parent.id;
                      await this.level2Selected();
                      this.data.address_id = this.user.address.id;

                      break;
                    case AddressesLevel.LEVEL1:
                      this.isLevel5Allowed = false;
                      this.isLevel4Allowed = false;
                      this.isLevel3Allowed = false;
                      this.isLevel2Allowed = false;
                      this.level1Addresses =
                        await this.addressesService.GetLevel1Addresses();
                      this.data.address_id = this.user.address.id;
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

  update() {
    this.isUpdateLoading = true;
    if (!this.data.name) {
      this.alertService.toastError('Customer name should be provided');
      this.isUpdateLoading = false;
      return;
    }

    if (!this.data.address_id) {
      this.alertService.toastError('Address should be provided');
      this.isUpdateLoading = false;
      return;
    }

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
