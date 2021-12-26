import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from 'src/app/common/modals/delete-modal/delete-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Company } from 'src/models/company.model';

@Component({
  selector: 'app-company-list-item',
  templateUrl: './company-list-item.component.html',
  styleUrls: ['./company-list-item.component.css'],
})
export class CompanyListItemComponent {
  @Input('company') company: Company;

  constructor(
    private modalService: NgbModal,
    private companiesServices: CompaniesService,
    private alertService: AlertService,
    private authService: AuthService
  ) {}

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
}
