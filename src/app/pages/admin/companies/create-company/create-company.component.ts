import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Company } from 'src/models/company.model';
import { loadingGifUrl } from './../../../../../constants/constants';
import { AdminCreateCompanyDTO } from './../../../../../dtos/create-company.dto';
import { AddressesLevel } from './../../../../../enums/addresses.enum';

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.css'],
})
export class AdminCreateCompanyComponent implements OnInit {
  isStoreLoading: boolean = false;
  addresses: string[] = [];
  company: AdminCreateCompanyDTO = {
    name: null,
    balance: null,
    maxManagersNumber: null,
    maxSupervisorsNumber: null,
    maxCollectorsNumber: null,
    maxCustomersNumber: null,
    maxLocationLevel: null,
    addressLevel1Name: null,
    addressLevel2Name: null,
    addressLevel3Name: null,
    addressLevel4Name: null,
    addressLevel5Name: null,
    createdBy_id: null,
  };
  loadingGif = loadingGifUrl;

  isLevel1Checked: boolean = true;
  isLevel2Checked: boolean = false;
  isLevel3Checked: boolean = false;
  isLevel4Checked: boolean = false;
  isLevel5Checked: boolean = false;

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.loadingService.appLoading(true);
    // this.loadingService.appLoading(false);
  }

  store() {
    this.isStoreLoading = true;

    if (
      !this.company.name ||
      !this.company.balance ||
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

    // TODO: validate address input according to level

    this.company.createdBy_id = this.authService.currentUser.id;

    this.companiesService.adminStore(this.company).subscribe(
      (res: Company) => {
        this.alertService.toastSuccess('Company added successfully');
        this.company = {
          name: null,
          balance: null,
          maxManagersNumber: null,
          maxSupervisorsNumber: null,
          maxCollectorsNumber: null,
          maxCustomersNumber: null,
          maxLocationLevel: null,
          addressLevel1Name: null,
          addressLevel2Name: null,
          addressLevel3Name: null,
          addressLevel4Name: null,
          addressLevel5Name: null,
          createdBy_id: null,
        };
        this.isStoreLoading = false;
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
