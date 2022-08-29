import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';
import { isEmployee } from 'src/utils/functions';

@Component({
  selector: 'app-show-company',
  templateUrl: './show-company.component.html',
  styleUrls: ['./show-company.component.css'],
})
export class AdminShowCompanyComponent implements OnInit {
  company_id: string;
  company: Company;
  employees: User[] = [];
  isLoading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private companiesService: CompaniesService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.company_id = this.route.snapshot.paramMap.get('id');
    this.companiesService.getById(this.company_id).subscribe(
      (data: Company) => {
        this.company = data;
        this.employees = this.company.users.filter((user) => {
          if (isEmployee(user)) return user;
        });
        this.isLoading = this.loadingService.appLoading(false);
      },
      (err) => {
        this.authService.handleHttpError(err);
      }
    );
  }
}
