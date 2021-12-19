import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-super-visors',
  templateUrl: './super-visors.component.html',
  styleUrls: ['./super-visors.component.css'],
})
export class SuperVisorsComponent implements OnInit {
  supervisors: User[] = [];
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
      .getCompanyEmployees(
        this.authService.currentUser.company_id,
        UserRoles.SUPERVISOR
      )
      .subscribe(
        (result: any) => {
          this.supervisors = result;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }
}
