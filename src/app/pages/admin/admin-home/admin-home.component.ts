import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  stats: {
    totalCustomers: number;
    invoicesCollectedToday: number;
    totalActiveEmployees: number;
    projectedMonthlyIncome: number;
  } = {
    totalCustomers: 0,
    invoicesCollectedToday: 0,
    totalActiveEmployees: 0,
    projectedMonthlyIncome: 0,
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
