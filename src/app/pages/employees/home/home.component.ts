import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/models/user.model';

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
  } = {
    company_balance: 0,
    customers_count: 0,
    unpaid_invoices_count: 0,
    amount_collected_today: 0,
  };
  currentUser: User;
  isLoading: boolean = true;

  constructor(
    private commonService: CommonService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

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
}
