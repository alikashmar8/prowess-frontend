import { getCurrencySymbol } from 'src/utils/functions';
import { AuthService } from 'src/app/services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyTransactionService } from 'src/app/services/company-transactions.service';
import { LoadingService } from 'src/app/services/loading.service';
import { CompanyTransaction } from 'src/models/company-transaction.model';
import { Currency } from 'src/enums/currency.enum';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent implements OnInit {
  isLoading: boolean = true;
  transactions: CompanyTransaction[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 25;
  totalItems: number = 0;
  totalPages: number = 0;
  totalTransactionsAmount: number = 0;

  filters: {
    take: number;
    skip: number;
    fromDate: any;
    toDate: any;
  } = {
    take: 10,
    skip: 0,
    fromDate: new Date().toISOString(),
    toDate: new Date().toISOString(),
  };

  constructor(
    private companyTransactionsService: CompanyTransactionService,
    private loadingService: LoadingService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    this.filters.fromDate = firstDayOfMonth.toISOString();

    try {
      await this.loadTransactions();
    } catch (err) {
      console.error(err);
      this.authService.handleHttpError(err);
    }
    this.isLoading = this.loadingService.appLoading(false);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  nextPage(): void {
    if (this.transactions?.length === this.itemsPerPage) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  async loadTransactions(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;
    this.filters.skip = skip;
    this.filters.take = take;

    const result: {
      transactions: CompanyTransaction[];
      count: number;
    } = await this.companyTransactionsService.getAll({
      ...this.filters,
    });
    this.transactions = result.transactions;
    this.totalItems = result.count;
    this.totalPages =
      this.totalItems > 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : 1;

    if (this.transactions?.length > 0)
      this.totalTransactionsAmount = Number(this.transactions[0].total);
    else this.totalTransactionsAmount = 0;

    this.isLoading = this.loadingService.appLoading(false);
  }

  getCurrencySymbol(currency: Currency): string {
    return getCurrencySymbol(currency);
  }
}
