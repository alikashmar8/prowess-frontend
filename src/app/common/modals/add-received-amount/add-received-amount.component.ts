import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReceivedAmountsService } from 'src/app/services/received-amounts.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from './../../../../models/user.model';
import { AlertService } from './../../../services/alert.service';
import { AuthService } from './../../../services/auth-service.service';
import { CompaniesService } from './../../../services/companies.service';

@Component({
  selector: 'app-add-received-amount',
  templateUrl: './add-received-amount.component.html',
  styleUrls: ['./add-received-amount.component.css'],
})
export class AddReceivedAmountComponent implements OnInit {
  employees: User[] = [];
  currentUser: User;
  data: {
    amount: number;
    employeeId: string;
  } = {
    amount: 0,
    employeeId: null,
  };
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private receivedAmountsService: ReceivedAmountsService,
    private companiesService: CompaniesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.companiesService
      .getCompanyEmployees(this.authService.currentUser.company_id)
      .subscribe(
        (result: any) => {
          this.employees = result;
          this.employees = this.employees?.filter((employee) => {
            if (
              employee.role != UserRoles.ADMIN &&
              employee.id != this.currentUser.id
            )
              return employee;
          });
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }

  store() {
    if (!this.data?.amount || !this.data.employeeId) {
      this.alertService.toastError('Please check all values before submit');
      return;
    }

    this.receivedAmountsService.store(this.data).subscribe(
      (result) => {
        this.alertService.toastSuccess('Amount added successfully');
        this.activeModal.close(true);
      },
      (err) => {
        this.alertService.toastError('Error adding amount');
        this.activeModal.close(false);
      }
    );
  }
}
