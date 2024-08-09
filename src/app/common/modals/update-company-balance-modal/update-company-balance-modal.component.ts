import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-update-company-balance-modal',
  templateUrl: './update-company-balance-modal.component.html',
  styleUrls: ['./update-company-balance-modal.component.css'],
})
export class UpdateCompanyBalanceModalComponent implements OnInit {
  @Input() companyId: string;

  company: Company;
  parentCompany: Company;
  isLoading: boolean = false;
  amount: number = 0;
  currentUser: User;

  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private companiesService: CompaniesService,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.companyId) this.activeModal.dismiss('No company id');

    this.isLoading = true;
    this.currentUser = this.authService.currentUser;
    this.companiesService
      .getById(this.companyId)
      .subscribe(async (data: Company) => {
        this.company = data;

        if (this.company.createdBy_id && !this.currentUser.isSuperAdmin) {
          this.activeModal.dismiss('Unauthorized');
        }

        if (
          this.company.parentCompany_id &&
          this.currentUser.role != UserRoles.ADMIN
        ) {
          this.activeModal.dismiss('Unauthorized');
        }

        if (this.company.parentCompany_id) {
          this.parentCompany = await this.companiesService.getByIdAsync(
            this.company.parentCompany_id
          );
        }

        this.isLoading = false;
      });
  }

  submit() {
    if (!this.amount) {
      this.activeModal.dismiss('Amount is 0');
      return;
    }

    if (
      this.parentCompany &&
      Number(this.parentCompany.balance) - Number(this.amount) < 0
    ) {
      this.alertService.toastError('Insufficient funds');
      return;
    }

    if (Number(this.company.balance) + Number(this.amount) < 0) {
      this.alertService.toastError('Company balance cannot be negative');
      return;
    }

    if (this.company.parentCompany_id) {
      this.companiesService
        .updateSubCompanyBalance(this.company.id, {
          amount: Number(this.amount),
        })
        .subscribe(
          (res) => {
            this.alertService.toastSuccess('Balance updated successfully!');
            this.activeModal.close('Balance updated');
            window.location.reload();
          },
          (err) => {
            this.authService.handleHttpError(err);
          }
        );
    } else {
      this.companiesService
        .adminUpdateBalance(this.company.id, {
          amount: this.amount,
        })
        .subscribe(
          (res) => {
            this.alertService.toastSuccess('Balance updated successfully!');
            this.activeModal.close('Balance updated');
            window.location.reload();
          },
          (err) => {
            this.authService.handleHttpError(err);
          }
        );
    }
  }
}
