import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-collectors',
  templateUrl: './collectors.component.html',
  styleUrls: ['./collectors.component.css']
})
export class CollectorsComponent implements OnInit {
  collectors: User[] = [];
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
        UserRoles.COLLECTOR
      )
      .subscribe(
        (result: any) => {
          this.collectors = result;
          this.isLoading = this.loadingService.appLoading(false);
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }
}
