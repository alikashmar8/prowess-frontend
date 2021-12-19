import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Company } from 'src/models/company.model';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
})
export class AdminCompaniesComponent implements OnInit {
  isLoading: boolean = true;
  companies: Company[] = [];
  search: string = '';
  constructor(
    private companiesService: CompaniesService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService.getAll().subscribe(
      (res: Company[]) => {
        this.companies = res;
        this.isLoading = this.loadingService.appLoading(false);
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isLoading = this.loadingService.appLoading(false);
      }
    );
  }
}
