import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Company } from 'src/models/company.model';

@Component({
  selector: 'app-sub-companies',
  templateUrl: './sub-companies.component.html',
  styleUrls: ['./sub-companies.component.css'],
})
export class SubCompaniesComponent implements OnInit {
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
    this.companiesService.getSubCompanies().subscribe(
      (res: [Company[], number]) => {
        this.companies = res[0];
        this.isLoading = this.loadingService.appLoading(false);
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isLoading = this.loadingService.appLoading(false);
      }
    );
  }
}
