import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PlansService } from 'src/app/services/plans.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreatePlanDTO } from 'src/dtos/create-plan.dto';

@Component({
  selector: 'app-create-plan',
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css'],
})
export class CreatePlanComponent implements OnInit {
  isLoading: boolean = true;
  isStoreLoading: boolean = false;
  loadingGif = loadingGifUrl;
  plan: CreatePlanDTO = {
    name: null,
    price: null,
    company_id: null,
  };

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private planService: PlansService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(false);
  }

  store() {
    this.isStoreLoading = true
    if (!this.plan.name || !this.plan.price) {
      this.alertService.toastError(
        'Please make sure name and price are set correctly'
      );
      this.isStoreLoading = false;
      return;
    }

    if(!this.authService.currentUser.company_id){
      this.alertService.toastError(
        'You are not employee in a company'
      );
      this.isStoreLoading = false
      return;
    }

    this.plan.company_id = this.authService.currentUser.company_id

    this.planService.store(this.plan).subscribe(res => {
      this.plan.name = null
      this.plan.price = null
      this.plan.company_id = null
      this.isStoreLoading= false
      this.alertService.toastSuccess('Plan added successfully')
    }, err => {
      this.authService.handleHttpError(err)
    })

  }
}
