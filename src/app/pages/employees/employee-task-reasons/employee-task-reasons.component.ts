import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddEmployeeTaskReasonModalComponent } from 'src/app/common/modals/add-employee-task-reason-modal/add-employee-task-reason-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { EmployeeTaskReasonsService } from 'src/app/services/employee-task-reasons.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InputType } from 'src/enums/input-type.enum';
import { EmployeeTaskReason } from 'src/models/employee-task-reason.model';

@Component({
  selector: 'app-employee-task-reasons',
  templateUrl: './employee-task-reasons.component.html',
  styleUrls: ['./employee-task-reasons.component.css'],
})
export class EmployeeTaskReasonsComponent implements OnInit {
  taskReasons: EmployeeTaskReason[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  isLoading: boolean = true;

  constructor(
    private employeeTaskReasonsService: EmployeeTaskReasonsService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.loadReasons();
    } catch (error) {
      this.authService.handleHttpError(error);
    }
  }

  async loadReasons(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;
    const result: {
      data: EmployeeTaskReason[];
      count: number;
    } = await this.employeeTaskReasonsService.getAll({
      skip,
      take,
    });
    this.taskReasons = result.data;
    this.totalItems = result.count;
    // this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.totalPages =
      this.totalItems > 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : 1;
    this.isLoading = this.loadingService.appLoading(false);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReasons();
    }
  }

  nextPage(): void {
    if (this.taskReasons?.length === this.itemsPerPage) {
      this.currentPage++;
      this.loadReasons();
    }
  }

  openNewTaskReasonModal(): void {
    const modalRef = this.modalService.open(
      AddEmployeeTaskReasonModalComponent,
      {
        size: 'lg',
      }
    );
    modalRef.result.then((result) => {
      if (result) {
        // Refresh tasks
        this.loadReasons();
      }
    });
  }

  deleteTaskReason(task) {
    if (confirm(`Are you sure you want to delete ${task.name}?`)) {
      this.employeeTaskReasonsService.delete(task.id).subscribe(
        () => {
          this.loadReasons();
        },
        (error) => {
          this.authService.handleHttpError(error);
        }
      );
    }
  }

  async openUpdateNameModal(reason: EmployeeTaskReason) {
    const res: string = await this.alertService.dynamicInputDialog({
      value: reason.name,
      inputType: InputType.TEXT,
      options: [],
    });

    if (res && res != reason.name) {
      this.employeeTaskReasonsService
        .update(reason.id, {
          name: res,
        })
        .subscribe(
          (response) => {
            this.alertService.toastSuccess('Updated successfully');
            reason.name = res;
          },
          (exception) => {
            this.alertService.toastError('Error updating!');
            this.authService.handleHttpError(exception);
          }
        );
    }
  }

  async openUpdateDescriptionModal(Reason: EmployeeTaskReason) {
    const res: string = await this.alertService.dynamicInputDialog({
      value: Reason.description,
      inputType: InputType.TEXT,
      options: [],
    });

    if (res && res != Reason.description) {
      this.employeeTaskReasonsService
        .update(Reason.id, {
          description: res,
        })
        .subscribe(
          (response) => {
            this.alertService.toastSuccess('Updated successfully');
            Reason.description = res;
          },
          (exception) => {
            this.alertService.toastError('Error updating!');
            this.authService.handleHttpError(exception);
          }
        );
    }
  }
}
