import { CompanyInvoicesType } from './../../../../enums/company-invoices-type.enum';
import { UsersService } from './../../../services/users.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-generate-invoice-modal',
  templateUrl: './generate-invoice-modal.component.html',
  styleUrls: ['./generate-invoice-modal.component.css'],
})
export class GenerateInvoiceModalComponent implements OnInit {
  @Input() customerId: string;
  currentUser: User;
  customer: User;
  isLoading: boolean = true;

  CompanyInvoicesType = CompanyInvoicesType;

  data: {
    counterValue: number;
    dueDate: Date;
  };

  invoiceTotal: number = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      if (!this.customerId) {
        this.alertService.toastError('Customer id is required');
        this.activeModal.dismiss();
        return;
      }
      this.currentUser = await this.authService.currentUser;

      this.customer = await this.usersService.getUserById(this.customerId);

      this.data = {
        counterValue: this.customer.lastCounterValue,
        dueDate: new Date(),
      };

      this.calculateInvoiceTotal();
    } catch (e) {
      console.error(e);

      this.authService.handleHttpError(e);
    }
    this.isLoading = false;
  }

  calculateInvoiceTotal() {
    const fixedPlansTotal = this.customer.plans.reduce(
      (acc, plan) => acc + Number(plan.price),
      0
    );

    const counterDiff = this.data.counterValue - this.customer.lastCounterValue;
    const counterTotal = counterDiff * this.currentUser.company.pricePerCounter;

    this.invoiceTotal = fixedPlansTotal + counterTotal;
  }

  async submit() {
    if (
      this.currentUser.company.invoicesType ===
        CompanyInvoicesType.PER_COUNTER &&
      this.customer.isPerCounter
    ) {
      if (!this.data.dueDate) {
        this.alertService.toastError('Due date is required');
        return;
      }

      if (this.data.counterValue < this.customer.lastCounterValue) {
        this.alertService.toastError(
          'Counter value must be greater than the last counter value'
        );
        return;
      }
    }

    try {
      const planId = this.customer.plans[0].id;
      await this.usersService.generateNewInvoice({
        customer_id: this.customerId,
        plan_id: planId,
        counterValue: Number(this.data.counterValue),
        dueDate: this.data.dueDate,
      });
      this.alertService.toastSuccess('Invoice generated successfully');
      this.activeModal.close();
      window.location.reload();
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
