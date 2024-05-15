import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/models/user.model';
import { getMonthName } from 'src/utils/functions';

@Component({
  selector: 'app-old-unpaid-invoices',
  templateUrl: './balance-due-invoices.component.html',
  styleUrls: ['./balance-due-invoices.component.css'],
})
export class BalanceDueInvoicesComponent implements OnInit {
  isLoading: boolean = true;
  customers = [];
  total = '';
  today = new Date();
  take: number = 10;
  skip: number = 0;
  totalRecords: number = 0;
  currentPage: number = 1;
  totalPages: number;
  currentUser: User;

  months: {
    name: string;
    number: number;
  }[] = [];

  constructor(
    private usersService: UsersService,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      this.currentUser = this.authService.currentUser;

      const res = await this.usersService.getCustomersWithPendingUnpaidInvoices(
        {
          take: this.take,
          skip: this.skip,
        }
      );

      const { data: customers, total, count: totalRecords } = res;

      this.customers = customers;
      this.total = total;
      this.totalRecords = totalRecords;

      const currentMonth = this.today.getMonth() - 1;
      const monthsToDisplay = 11;

      this.months = Array.from({ length: monthsToDisplay }, (_, index) => {
        const monthIndex =
          currentMonth - index < 0
            ? 12 + (currentMonth - index)
            : currentMonth - index;
        return {
          name: getMonthName(monthIndex),
          number: monthIndex + 1,
        };
      });

      this.totalPages =
        this.totalRecords > 0 ? Math.ceil(this.totalRecords / this.take) : 1;
    } catch (err) {
      this.authService.handleHttpError(err);
    } finally {
      this.isLoading = this.loadingService.appLoading(false);
    }
  }

  previousPage() {
    if (this.currentPage == 1) return;
    this.currentPage--;
    this.skip = this.skip - this.take;
    this.ngOnInit();
  }
  nextPage() {
    if (this.currentPage == this.totalPages) return;
    this.currentPage++;
    this.skip = this.skip + this.take;
    this.ngOnInit();
  }
}
