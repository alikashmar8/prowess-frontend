import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-activate-customer-modal',
  templateUrl: './activate-customer-modal.component.html',
  styleUrls: ['./activate-customer-modal.component.css'],
})
export class ActivateCustomerModal implements OnInit {
  @Input() userName: string;
  @Input() customer_id: string;
  data: {
    invoice_total: number;
    invoice_notes?: string;
  } = {
    invoice_total: 0,
    invoice_notes: null,
  };
  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    if (!this.customer_id) {
      this.alertService.toastError('Customer ID is not passed');
      this.activeModal.dismiss();
    }
  }

  store() {
    this.usersService.activateCustomer(this.customer_id, this.data).subscribe(
      (result) => {
        this.alertService.toastSuccess('Customer activated successfully');
        this.activeModal.close(true);
      },
      (err) => {
        this.alertService.toastError('Error activating customer');
        this.activeModal.close(false);
      }
    );
  }
}
