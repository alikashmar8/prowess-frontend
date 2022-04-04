import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth-service.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { CreateItemInvoiceModal } from '../create-item-invoice-modal/create-item-invoice-modal.component';

@Component({
  selector: 'app-customer-items-modal',
  templateUrl: './customer-items-modal.component.html',
  styleUrls: ['./customer-items-modal.component.css'],
})
export class CustomerItemsModal implements OnInit {
  @Input() customer_id: string;
  invoices = [];
  currentUser: User;
  UserRole = UserRoles
  constructor(
    private modalService: NgbModal,
    private invoicesService: InvoicesService,
    private authService: AuthService,
    public activeModal: NgbActiveModal
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.customer_id) {
      this.activeModal.close();
      return;
    }

    try {
      this.currentUser = this.authService.currentUser;
      this.invoices = await this.invoicesService.getCustomerItemsInvoices(
        this.customer_id
      );
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  openCreateItemInvoiceModal() {
    const modalRef = this.modalService.open(CreateItemInvoiceModal);
    modalRef.componentInstance.customer_id = this.customer_id;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.invoices.push(result);
        }
      },
      (rejected) => {}
    );
  }
}
