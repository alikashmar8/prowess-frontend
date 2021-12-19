import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { Plan } from 'src/models/plan.model';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
})
export class PlansComponent implements OnInit {
  isLoading: boolean = true;
  plans: Plan[] = [];

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private plansService: PlansService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true)
    this.plansService.getCompanyPlans(this.authService.currentUser.company_id).subscribe((result: Plan[]) => {
      this.plans = result
      this.isLoading = this.loadingService.appLoading(false)
    })
  }
}
