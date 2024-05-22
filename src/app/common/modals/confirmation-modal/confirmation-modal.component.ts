import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from 'src/models/user.model';
import { ModalType } from './../../../../enums/modal-type.enum';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent implements OnInit {
  @Input() message: string;
  @Input() type = ModalType.DEFAULT;
  ModalType = ModalType;
  UserRole = UserRoles;
  currentUser;
  collector_id = null;
  employees: User[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    public authService: AuthService,
    private alertService: AlertService,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    if (
      this.type == ModalType.COLLECT_INVOICE ||
      this.type == ModalType.FORGIVE_INVOICE
    ) {
      this.companiesService
        .getCompanyEmployees(this.currentUser.company_id)
        .subscribe(
          (result: any) => {
            this.employees = result;
          },
          (error) => {
            this.authService.handleHttpError(error);
          }
        );
    }
  }

  submit() {
    switch (this.type) {
      case ModalType.COLLECT_INVOICE:
        return this.submitCollectInvoice();
      case ModalType.FORGIVE_INVOICE:
        return this.submitForgiveInvoice();
      default:
        this.activeModal.close(false);
        break;
    }
  }

  submitCollectInvoice() {
    if (this.currentUser.role == UserRoles.COLLECTOR)
      this.collector_id = this.currentUser.id;
    if (this.collector_id) {
      this.activeModal.close({
        collector_id: this.collector_id,
      });
    } else {
      this.alertService.toastError('A collector should be selected first');
      return;
    }
  }

  submitForgiveInvoice() {
    this.collector_id = this.currentUser.id;
    this.activeModal.close({
      collector_id: this.collector_id,
    });
  }
}
