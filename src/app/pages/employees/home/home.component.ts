import { UserRoles } from 'src/enums/user-roles.enum';
import { ListReceivedAmountsComponent } from './../../../common/modals/list-received-amounts/list-received-amounts.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/models/user.model';
import { AddReceivedAmountComponent } from 'src/app/common/modals/add-received-amount/add-received-amount.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class EmployeesHomeComponent implements OnInit {
  stats: {
    company_balance: number;
    customers_count: number;
    unpaid_invoices_count: number;
    amount_collected_today: number;
    items_amount_collected_today: number;
  } = {
    company_balance: 0,
    customers_count: 0,
    unpaid_invoices_count: 0,
    amount_collected_today: 0,
    items_amount_collected_today: 0,
  };
  currentUser: User;
  isLoading: boolean = true;
  UserRoles = UserRoles;

  constructor(
    private commonService: CommonService,
    private alertService: AlertService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    this.currentUser = this.authService.currentUser;
  }

  async ngOnInit(): Promise<void> {
    try {
      this.currentUser = this.authService.currentUser;
      this.stats = await this.commonService.getStats();
      this.isLoading = false;
    } catch (e) {
      console.log(e);
      this.alertService.toastError('Error fetching dashboard stats');
    }
  }

  openAddAmountModal() {
    const modalRef = this.modalService.open(AddReceivedAmountComponent);
    modalRef.result.then(
      (result) => {
        if (result) {
          if (result) window.location.reload();
        }
      },
      (rejected) => {}
    );
  }

  openListAmountsModal() {
    const modalRef = this.modalService.open(ListReceivedAmountsComponent, {
      animation: true,
      centered: true,
      keyboard: true,
      size: 'lg',
    });
    modalRef.result.then(
      (result) => {
        if (result) {
          if (result) window.location.reload();
        }
      },
      (rejected) => {}
    );
  }
}
