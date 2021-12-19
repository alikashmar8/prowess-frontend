import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Company } from 'src/models/company.model';
import { loadingGifUrl } from './../../../../../constants/constants';
import { AdminCreateCompanyDTO } from './../../../../../dtos/create-company.dto';
import { AddressesEnum } from './../../../../../enums/addresses.enum';

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
    maxLocationToEnter: null,
    createdBy_id: null,
  };
  loadingGif = loadingGifUrl;

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadingService.appLoading(true);
    for (var enumMember in AddressesEnum) {
      this.addresses.push(enumMember);
    }
    this.company.maxLocationToEnter = this.addresses[0];
    this.loadingService.appLoading(false);
  }

  store() {
    this.isStoreLoading = true;

    if (
      !this.company.name ||
      !this.company.balance ||
      !this.company.maxCollectorsNumber ||
      !this.company.maxCustomersNumber ||
      !this.company.maxLocationToEnter ||
      !this.company.maxManagersNumber ||
      !this.company.maxSupervisorsNumber
    ) {
      this.alertService.toastError(
        'Please check all values before you continue'
      );
      this.alertService.error('Please check all values before you continue');
      this.isStoreLoading = false;
      return;
    }
    this.company.createdBy_id = this.authService.currentUser.id;

    this.companiesService.adminStore(this.company).subscribe(
      (res: Company) => {
        console.log(res);

        // this.router.navigate([`/companies/${res.id}`]);
        this.isStoreLoading = false;
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isStoreLoading = false;
      }
    );
  }
}
