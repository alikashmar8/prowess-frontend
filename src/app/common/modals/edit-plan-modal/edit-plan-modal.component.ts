import { loadingGifUrl } from 'src/constants/constants';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlansService } from 'src/app/services/plans.service';
import { Plan } from 'src/models/plan.model';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-edit-plan-modal',
  templateUrl: './edit-plan-modal.component.html',
  styleUrls: ['./edit-plan-modal.component.css'],
})
export class EditPlanModalComponent implements OnInit {
  @Input() plan: Plan;
  isUpdateLoading: boolean = false;
  loadingGifUrl = loadingGifUrl;

  constructor(
    public activeModal: NgbActiveModal,
    private plansService: PlansService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {}

  update() {
    this.isUpdateLoading = true;

    if (!this.plan.name) {
      this.alertService.toastError('Plan name is required');
      this.isUpdateLoading = false;
      return;
    }

    if (!this.plan.price) {
      this.alertService.toastError('Plan price is required');
      this.isUpdateLoading = false;
      return;
    }

    this.plansService
      .update(this.plan.id, {
        name: this.plan.name,
        price: Number(this.plan.price),
        isActive: this.plan.isActive,
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
