import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { PlansService } from 'src/app/services/plans.service';
import { UsersService } from 'src/app/services/users.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Plan } from 'src/models/plan.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-update-customer-plans-modal',
  templateUrl: './update-customer-plans-modal.component.html',
  styleUrls: ['./update-customer-plans-modal.component.css'],
})
export class UpdateCustomerPlansModal implements OnInit {
  @Input() customer_id: string = null;
  user: User;
  isLoading = false;
  isUpdateLoading: boolean = false;
  currentUser: User = null;
  plans: Plan[] = [];
  selectedPlans = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownList = [];

  data: {
    ids: string[];
    invoice_total: number;
    invoice_note?: string;
  } = {
    ids: [],
    invoice_total: 0,
  };

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private alertService: AlertService,
    private plansService: PlansService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;
      if (!this.customer_id) {
        this.alertService.toastError('Customer ID is required');
        this.activeModal.dismiss();
        this.isLoading = false;
      }

      this.currentUser = this.authService.currentUser;
      if (
        this.currentUser.role == UserRoles.CUSTOMER &&
        this.currentUser.id != this.customer_id
      ) {
        this.alertService.toastError(
          'You are not authorized to update this customer'
        );
        this.activeModal.dismiss();
        this.isLoading = false;
      }

      this.user = await this.usersService.getUserById(this.customer_id);
      if (this.user.company_id != this.currentUser.company_id) {
        this.alertService.toastError(
          'You are not authorized to update this customer'
        );
        this.activeModal.dismiss();
        this.isLoading = false;
      }

      this.plansService.getActivePlans().subscribe(
        async (res: any) => {
          this.plans = res;
          this.dropdownList = this.plans;
          this.user.plans.forEach((plan) => {
            this.selectedPlans.push({
              id: plan.id,
              name: plan.name,
            });
          });
          this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 2,
            limitSelection: 2,
            allowSearchFilter: true,
            closeDropDownOnSelection: true,
          };
          this.isLoading = false;
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
    } catch (error) {
      this.alertService.toastError('Error loading data');
      this.activeModal.dismiss();
      this.isLoading = false;
    }
  }

  async update() {
    try {
      this.isUpdateLoading = true;
      if (this.selectedPlans.length == 0) {
        this.alertService.toastError('Please select at least one plan');
        this.isUpdateLoading = false;
        return;
      }
      const selectedPlansIds = this.selectedPlans.map((plan) => plan.id);
      this.data.ids = selectedPlansIds;
      console.log('updating before request');

      await this.usersService.updateCustomerPlans(
        this.customer_id,
        this.data
      );

      console.log('updating after request');

      this.alertService.toastSuccess('Plans updated successfully');
      this.activeModal.close();
      this.isUpdateLoading = false;
    } catch (error) {
      this.alertService.toastError('Error updating plans');
      this.activeModal.dismiss();
      this.isUpdateLoading = false;
    }
  }

}
