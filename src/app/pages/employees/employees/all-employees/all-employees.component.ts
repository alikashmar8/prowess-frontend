import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.css'],
})
export class AllEmployeesComponent implements OnInit {
  employees = [];
  isLoading: boolean = true;
  search: string;

  constructor(
    private companiesService: CompaniesService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.companiesService
      .getCompanyEmployees(this.authService.currentUser.company_id)
      .subscribe(
        (result: any) => {
          this.employees = result;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }
}
