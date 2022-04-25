import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPlanModalComponent } from 'src/app/common/modals/edit-plan-modal/edit-plan-modal.component';
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
    private plansService: PlansService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true)
    this.plansService.getCompanyPlans(this.authService.currentUser.company_id).subscribe((result: Plan[]) => {
      this.plans = result
      this.isLoading = this.loadingService.appLoading(false)
    })
  }


  openEditItemModal(plan: Plan) {
    const modalRef = this.ngbModal.open(EditPlanModalComponent);
    modalRef.componentInstance.plan = plan;
    modalRef.result
      .then(
        (result) => {},
        (rejected) => {}
      )
      .catch();
  }

  async updateStatus(plan: Plan, status: boolean) {
    this.plansService.updateStatus(plan.id, status).subscribe(
      (result: any) => {
        plan.isActive = status;
      },
      (error) => {
        this.authService.handleHttpError(error);
      }
    );
  }
}
