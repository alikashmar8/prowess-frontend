import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { loadingGifUrl } from 'src/constants/constants';
import { AddressesEnum } from 'src/enums/addresses.enum';
import { Company } from './../../../../../models/company.model';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
})
export class AdminEditCompanyComponent implements OnInit {
  isUpdateLoading: boolean = false;
  addresses: string[] = [];
  company_id: string;
  company: Company;
  isLoading: boolean = true;
  loadingGif = loadingGifUrl;

  constructor(
    private companiesService: CompaniesService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.company_id = this.route.snapshot.paramMap.get('id');
    for (var enumMember in AddressesEnum) {
      this.addresses.push(enumMember);
    }
    this.companiesService.getById(this.company_id).subscribe(
      (data: Company) => {
        console.log(data);
        this.company = data;
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
      this.isUpdateLoading = false;
      return;
    }

    this.companiesService
      .adminUpdate(this.company_id, {
        name: this.company.name,
        balance: this.company.balance,
        maxCollectorsNumber: this.company.maxCollectorsNumber,
        createdBy_id: this.company.createdBy_id,
        maxCustomersNumber: this.company.maxCustomersNumber,
        maxLocationToEnter: this.company.maxLocationToEnter,
        maxManagersNumber: this.company.maxManagersNumber,
        maxSupervisorsNumber: this.company.maxSupervisorsNumber,
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
}
