import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css'],
})
export class FilterModalComponent implements OnInit {
  @Input() employees = [];
  @Input() plans = [];
  @Input() startDateFilter: Date;
  @Input() endDateFilter: Date;
  @Input() employeeFilter = [];
  @Input() planFilter = [];
  @Input() search: string = '';
  @Input() selectedEmployee: string = '';
  @Input() selectedPlan: string = '';
  @Input() showPlansFilter: boolean = true;

  UserRole = UserRoles;
  currentUser: User;
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
  }

  onSearch() {
    if (this.endDateFilter < this.startDateFilter) {
      this.alertService.toastError('End date must be greater than start date');
      return;
    }

    this.activeModal.close({
      search: this.search,
      selectedEmployee: this.selectedEmployee,
      selectedPlan: this.selectedPlan,
      startDateFilter: this.startDateFilter,
      endDateFilter: this.endDateFilter,
    });
  }

  clearFilters() {
    this.search = '';
    this.selectedEmployee = '';
    this.selectedPlan = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
  }
}
