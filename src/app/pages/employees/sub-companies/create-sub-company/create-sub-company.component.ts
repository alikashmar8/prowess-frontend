import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Currency } from 'src/enums/currency.enum';
import { InvoiceSharingType } from 'src/enums/invoice-sharing-type';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';
import { loadingGifUrl } from '../../../../../constants/constants';
import { AdminCreateCompanyDTO } from '../../../../../dtos/create-company.dto';
import { AddressesLevel } from '../../../../../enums/addresses.enum';
import { CollectingType } from '../../../../../enums/collecting-type.enum';
import { InvoicesSortingType } from '../../../../../enums/invoices-sorting-type';
import { CompanyInvoicesType } from './../../../../../enums/company-invoices-type.enum';

@Component({
  selector: 'app-create-sub-company',
  templateUrl: './create-sub-company.component.html',
  styleUrls: ['./create-sub-company.component.css'],
})
export class CreateSubCompanyComponent implements OnInit {
  isStoreLoading: boolean = false;
  addresses: string[] = [];
  company: AdminCreateCompanyDTO = {
    name: null,
    balance: null,
    phoneNumber: null,
    secondaryPhoneNumber: null,
    email: null,
    maxManagersNumber: null,
    maxSupervisorsNumber: null,
    maxCollectorsNumber: null,
    maxCustomersNumber: null,
    managerAccountPrice: 20,
    supervisorAccountPrice: 15,
    collectorAccountPrice: 15,
    currency: Currency.USD,
    collectingType: CollectingType.MONTHLY,
    invoicesSortingType: InvoicesSortingType.DUE_DATE,
    invoiceSharingType: InvoiceSharingType.DEFAULT_SHARE,
    maxLocationLevel: null,
    allowDataImport: false,
    addressLevel1Name: null,
    addressLevel2Name: null,
    addressLevel3Name: null,
    addressLevel4Name: null,
    addressLevel5Name: null,
    invoicesType: CompanyInvoicesType.PER_PLAN_MONTHLY,
    pricePerCounter: 0,
  };
  loadingGif = loadingGifUrl;

  isLevel1Checked: boolean = true;
  isLevel2Checked: boolean = false;
  isLevel3Checked: boolean = false;
  isLevel4Checked: boolean = false;
  isLevel5Checked: boolean = false;

  CollectingType = CollectingType;
  InvoicesSortingType = InvoicesSortingType;
  InvoiceSharingType = InvoiceSharingType;
  Currency = Currency;
  currentUser: User;
  CompanyInvoicesType = CompanyInvoicesType;

  constructor(
    private companiesService: CompaniesService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  store() {
    this.isStoreLoading = true;

    if (
      !this.company.name ||
      !this.company.balance ||
      !this.company.phoneNumber ||
      !this.company.maxCollectorsNumber ||
      !this.company.maxCustomersNumber ||
      !this.company.maxLocationLevel ||
      !this.company.maxManagersNumber ||
      !this.company.maxSupervisorsNumber ||
      !this.company.addressLevel1Name
    ) {
      this.alertService.toastError(
        'Please check all values before you continue'
      );
      this.alertService.error('Please check all values before you continue');
      this.isStoreLoading = false;
      return;
    }

    if (
      this.company.managerAccountPrice <
      this.currentUser.company.managerAccountPrice
    ) {
      this.alertService.toastError(
        'Manager account price must be greater than or equal to the parent company'
      );
      this.isStoreLoading = false;
      return;
    }

    if (
      this.company.supervisorAccountPrice <
      this.currentUser.company.supervisorAccountPrice
    ) {
      this.alertService.toastError(
        'Supervisor account price must be greater than or equal to the parent company'
      );
      this.isStoreLoading = false;
      return;
    }

    if (
      this.company.collectorAccountPrice <
      this.currentUser.company.collectorAccountPrice
    ) {
      this.alertService.toastError(
        'Collector account price must be greater than or equal to the parent company'
      );
      this.isStoreLoading = false;
      return;
    }

    // TODO: validate address input according to level

    this.company.currency = this.currentUser.company.currency;
    this.companiesService.storeSubCompany(this.company).subscribe(
      (res: Company) => {
        this.alertService.toastSuccess('Company added successfully');
        this.company = {
          name: null,
          balance: null,
          phoneNumber: null,
          secondaryPhoneNumber: null,
          email: null,
          maxManagersNumber: null,
          maxSupervisorsNumber: null,
          maxCollectorsNumber: null,
          maxCustomersNumber: null,
          managerAccountPrice: null,
          supervisorAccountPrice: null,
          collectorAccountPrice: null,
          currency: Currency.USD,
          collectingType: CollectingType.MONTHLY,
          invoicesSortingType: InvoicesSortingType.DUE_DATE,
          invoiceSharingType: InvoiceSharingType.DEFAULT_SHARE,
          maxLocationLevel: null,
          allowDataImport: false,
          addressLevel1Name: null,
          addressLevel2Name: null,
          addressLevel3Name: null,
          addressLevel4Name: null,
          addressLevel5Name: null,
          invoicesType: CompanyInvoicesType.PER_PLAN_MONTHLY,
          pricePerCounter: 0,
        };
        this.isStoreLoading = false;
        // go back:
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isStoreLoading = false;
      }
    );
  }

  level1Clicked() {
    this.isLevel1Checked = true;
    this.isLevel2Checked = false;
    this.isLevel3Checked = false;
    this.isLevel4Checked = false;
    this.isLevel5Checked = false;
    this.company.maxLocationLevel = AddressesLevel.LEVEL1;
  }

  level2Clicked() {
    if (this.isLevel2Checked) {
      this.isLevel2Checked = true;
      this.isLevel3Checked = false;
      this.isLevel4Checked = false;
      this.isLevel5Checked = false;
    } else {
      this.isLevel1Checked = true;
      this.isLevel2Checked = true;
    }
    this.company.maxLocationLevel = AddressesLevel.LEVEL2;
  }

  level3Clicked() {
    if (this.isLevel3Checked) {
      this.isLevel2Checked = true;
      this.isLevel3Checked = true;
      this.isLevel4Checked = false;
      this.isLevel5Checked = false;
    } else {
      this.isLevel1Checked = true;
      this.isLevel2Checked = true;
      this.isLevel3Checked = true;
    }
    this.company.maxLocationLevel = AddressesLevel.LEVEL3;
  }

  level4Clicked() {
    if (this.isLevel4Checked) {
      this.isLevel2Checked = true;
      this.isLevel3Checked = true;
      this.isLevel4Checked = true;
      this.isLevel5Checked = false;
    } else {
      this.isLevel1Checked = true;
      this.isLevel2Checked = true;
      this.isLevel3Checked = true;
      this.isLevel4Checked = true;
    }
    this.company.maxLocationLevel = AddressesLevel.LEVEL4;
  }

  level5Clicked() {
    this.isLevel1Checked = true;
    this.isLevel2Checked = true;
    this.isLevel3Checked = true;
    this.isLevel4Checked = true;
    this.isLevel5Checked = true;

    this.company.maxLocationLevel = AddressesLevel.LEVEL5;
  }
}
