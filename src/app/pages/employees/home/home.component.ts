import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { async } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/models/user.model';
import { getLang, setLang } from 'src/utils/functions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class EmployeesHomeComponent implements OnInit {
  stats: {
    customers_count: number;
    unpaid_invoices_count: number;
    amount_collected_today: number;
  } = {
    customers_count: 0,
    unpaid_invoices_count: 0,
    amount_collected_today: 0,
  };
  currentUser: User;

  constructor(
    private commonService: CommonService,
    private alertService: AlertService,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    var storedLang: string = getLang();
    if (storedLang !== '') {
      translate.use(storedLang);
    }
    else {
      translate.use('en');
      setLang('en');
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      this.currentUser = this.authService.currentUser;
      this.stats = await this.commonService.getStats();
    } catch (e) {
      this.alertService.toastError('Error fetching dashboard stats');
    }
  }
}
