import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { PlansService } from 'src/app/services/plans.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CompanyInvoicesType } from 'src/enums/company-invoices-type.enum';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-edit-plan-modal',
  templateUrl: './edit-plan-modal.component.html',
  styleUrls: ['./edit-plan-modal.component.css'],
})
export class EditPlanModalComponent implements OnInit {
  @Input() plan: Plan;
  isUpdateLoading: boolean = false;
  loadingGifUrl = loadingGifUrl;
  currentUser: User;
  CompanyInvoicesType = CompanyInvoicesType;

  constructor(
    public activeModal: NgbActiveModal,
    private plansService: PlansService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {}

  update() {
    this.isUpdateLoading = true;

    if (!this.plan.name) {
      this.alertService.toastError('Plan name is required');
      this.isUpdateLoading = false;
      return;
    }

    if (!this.plan.price || !Number(this.plan.price)) {
      this.alertService.toastError('Plan price is required');
      this.isUpdateLoading = false;
      return;
    }

    this.plansService
      .update(this.plan.id, {
        name: this.plan.name,
        price: Number(this.plan.price),
        isActive: this.plan.isActive,
        pricePerCounter: this.plan.pricePerCounter,
      })
      .subscribe(
        (result: any) => {
          this.isUpdateLoading = false;
          this.activeModal.close(this.plan);
        },
        (error) => {
          this.isUpdateLoading = false;
          this.alertService.toastError('Error updating plan!');
        }
      );
  }
}
