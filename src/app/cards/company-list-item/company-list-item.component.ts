import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from 'src/app/common/modals/delete-modal/delete-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { InputType } from 'src/enums/input-type.enum';
import { Company } from 'src/models/company.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-company-list-item',
  templateUrl: './company-list-item.component.html',
  styleUrls: ['./company-list-item.component.css'],
})
export class CompanyListItemComponent {
  @Input('company') company: Company;
  currentUser: User;

  constructor(
    private modalService: NgbModal,
    private companiesServices: CompaniesService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUser;
  }

  openDeleteModal() {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.name = this.company.name;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.companiesServices.adminDelete(this.company.id).subscribe(
            (result: any) => {
              if (result.affected > 0) {
                this.alertService.toastSuccess('Company deleted successfully');
                window.location.reload();
              } else {
                this.alertService.toastError('Error deleting company');
              }
            },
            (error) => {
              this.authService.handleHttpError(error);
            }
          );
        }
      },
      (rejected) => {}
    );
  }

  async openEditBalanceModal(company: Company) {
    const result = await this.alertService.dynamicInputDialog({
      label: 'balance',
      inputType: InputType.NUMBER,
      value: company.balance,
    });

    if (result && Number(result) != this.company.balance) {
      this.companiesServices
        .adminUpdateBalance(company.id, {
          balance: result,
        })
        .subscribe(
          (res) => {
            this.alertService.toastSuccess('Balance updated successfully!');
            window.location.reload();
          },
          (err) => {
            this.authService.handleHttpError(err);
          }
        );
    }
  }
}
