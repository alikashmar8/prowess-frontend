import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { loadingGifUrl } from 'src/constants/constants';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { CollectingType } from 'src/enums/collecting-type.enum';
import { CompanyInvoicesType } from 'src/enums/company-invoices-type.enum';
import { Currency } from 'src/enums/currency.enum';
import { InvoiceSharingType } from 'src/enums/invoice-sharing-type';
import { InvoicesSortingType } from 'src/enums/invoices-sorting-type';
import { Company } from '../../../../../models/company.model';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-sub-company.component.html',
  styleUrls: ['./edit-sub-company.component.css'],
})
export class EditSubCompanyComponent implements OnInit {
  isUpdateLoading: boolean = false;
  addresses: string[] = [];
  company_id: string;
  company: Company;
  isLoading: boolean = true;
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
  CompanyInvoicesType = CompanyInvoicesType;

  constructor(
    private companiesService: CompaniesService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.company_id = this.route.snapshot.paramMap.get('id');
    this.companiesService.getById(this.company_id).subscribe(
      (data: Company) => {
        this.company = data;
        this.handleAddressLevels(data.maxLocationLevel);
        this.isLoading = this.loadingService.appLoading(false);
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isLoading = this.loadingService.appLoading(false);
      }
    );
  }

  update() {
    this.isUpdateLoading = true;

    if (
      !this.company.name ||
      !this.company.phoneNumber ||
      !this.company.maxCollectorsNumber ||
      !this.company.maxCustomersNumber ||
      !this.company.maxLocationLevel ||
      !this.company.maxManagersNumber ||
      !this.company.maxSupervisorsNumber
    ) {
      this.alertService.toastError(
        'Please check all values before you continue'
      );
      this.alertService.error('Please check all values before you continue');
      this.isUpdateLoading = false;
      return;
    }

    this.companiesService
      .update(this.company_id, {
        name: this.company.name,
        phoneNumber: this.company.phoneNumber,
        secondaryPhoneNumber: this.company.secondaryPhoneNumber,
        email: this.company.email,
        maxCollectorsNumber: this.company.maxCollectorsNumber,
        createdBy_id: this.company.createdBy_id,
        maxCustomersNumber: this.company.maxCustomersNumber,
        managerAccountPrice: this.company.managerAccountPrice,
        supervisorAccountPrice: this.company.supervisorAccountPrice,
        collectorAccountPrice: this.company.collectorAccountPrice,
        currency: this.company.currency,
        collectingType: this.company.collectingType,
        invoicesSortingType: this.company.invoicesSortingType,
        invoiceSharingType: this.company.invoiceSharingType,
        maxLocationLevel: this.company.maxLocationLevel,
        maxManagersNumber: this.company.maxManagersNumber,
        maxSupervisorsNumber: this.company.maxSupervisorsNumber,
        allowDataImport: this.company.allowDataImport,
        addressLevel1Name: this.company.addressLevel1Name,
        addressLevel2Name: this.company.addressLevel2Name,
        addressLevel3Name: this.company.addressLevel3Name,
        addressLevel4Name: this.company.addressLevel4Name,
        addressLevel5Name: this.company.addressLevel5Name,
      })
      .subscribe(
        (result) => {
          this.alertService.toastSuccess('Company updated successfully');
          this.isUpdateLoading = false;
        },
        (err) => {
          this.authService.handleHttpError(err);
          this.isUpdateLoading = false;
        }
      );
  }
  handleAddressLevels(maxLocationLevel: AddressesLevel) {
    switch (maxLocationLevel) {
      case AddressesLevel.LEVEL1:
        this.isLevel1Checked = true;
        this.isLevel2Checked = false;
        this.isLevel3Checked = false;
        this.isLevel4Checked = false;
        this.isLevel5Checked = false;
        break;
      case AddressesLevel.LEVEL2:
        this.isLevel1Checked = true;
        this.isLevel2Checked = true;
        this.isLevel3Checked = false;
        this.isLevel4Checked = false;
        this.isLevel5Checked = false;
        break;
      case AddressesLevel.LEVEL3:
        this.isLevel1Checked = true;
        this.isLevel2Checked = true;
        this.isLevel3Checked = true;
        this.isLevel4Checked = false;
        this.isLevel5Checked = false;
        break;
      case AddressesLevel.LEVEL4:
        this.isLevel1Checked = true;
        this.isLevel2Checked = true;
        this.isLevel3Checked = true;
        this.isLevel4Checked = true;
        this.isLevel5Checked = false;
        break;
      case AddressesLevel.LEVEL5:
        this.isLevel1Checked = true;
        this.isLevel2Checked = true;
        this.isLevel3Checked = true;
        this.isLevel4Checked = true;
        this.isLevel5Checked = true;
        break;
    }
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
