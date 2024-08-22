import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { EmployeeTasksService } from 'src/app/services/employee-tasks.service';
import { LoadingService } from 'src/app/services/loading.service';
import { InputType } from 'src/enums/input-type.enum';
import { EmployeeTaskType } from 'src/models/employee-task-type.model';
import { EmployeeTask } from 'src/models/employee-task.model';
import { AddEmployeeTaskTypeModalComponent } from '../employee-task-types/add-employee-task-type-modal/add-employee-task-type-modal.component';
import { EmployeeTaskStatus } from 'src/enums/employee-task-status';
import { AddEmployeeTaskModalComponent } from './add-employee-task-modal/add-employee-task-modal.component';
import { EmployeeTaskPriority } from 'src/enums/employee-task-priority.enum';
import { ShowEmployeeTaskModalComponent } from './show-employee-task-modal/show-employee-task-modal.component';

@Component({
  selector: 'app-employee-tasks',
  templateUrl: './employee-tasks.component.html',
  styleUrls: ['./employee-tasks.component.css'],
})
export class EmployeeTasksComponent implements OnInit {
  tasks: EmployeeTask[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  isLoading: boolean = true;

  constructor(
    private employeeTasksService: EmployeeTasksService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private modalService: NgbModal,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.loadTasks();
    } catch (error) {
      this.authService.handleHttpError(error);
    }
  }

  async loadTasks(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;
    const result: {
      data: EmployeeTask[];
      count: number;
    } = await this.employeeTasksService.getAll({
      skip,
      take,
    });
    this.tasks = result.data;
    this.totalItems = result.count;
    this.totalPages =
      this.totalItems > 0 ? Math.ceil(this.totalItems / this.itemsPerPage) : 1;
    this.isLoading = this.loadingService.appLoading(false);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  nextPage(): void {
    if (this.tasks?.length === this.itemsPerPage) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  // deleteTaskType(task: EmployeeTask) {
  //   if (confirm(`Are you sure you want to delete ${task.name} for ${task.customer.name}?`)) {
  //     this.employeeTasksService.delete(task.id).subscribe(
  //       () => {
  //         this.loadTasks();
  //       },
  //       (error) => {
  //         this.authService.handleHttpError(error);
  //       }
  //     );
  //   }
  // }

  async openUpdateStatusModal(task) {
    const result = await this.alertService.dynamicInputDialog({
      value: task.status,
      inputType: InputType.SELECT,
      options: [
        { value: EmployeeTaskStatus.PENDING, label: 'Pending' },
        { value: EmployeeTaskStatus.CANCELLED, label: 'Cancelled' },
        { value: EmployeeTaskStatus.COMPLETED, label: 'Completed' },
      ],
    });

    if (result && result != task.status) {
      this.employeeTasksService.update(task.id, { status: result }).subscribe(
        (response) => {
          this.alertService.toastSuccess('Updated successfully');
          task.status = result;
        },
        (exception) => {
          this.alertService.toastError('Error updating!');
          this.authService.handleHttpError(exception);
        }
      );
    }
  }

  openUpdateFinishDateModal(task) {
    this.alertService
      .dynamicInputDialog({
        value: task.finishDate,
        inputType: InputType.DATE,
        options: [],
      })
      .then((result) => {
        if (result && result != task.finishDate) {
          this.employeeTasksService
            .update(task.id, { finishDate: result })
            .subscribe(
              (response) => {
                this.alertService.toastSuccess('Updated successfully');
                task.finishDate = result;
              },
              (exception) => {
                this.alertService.toastError('Error updating!');
                this.authService.handleHttpError(exception);
              }
            );
        }
      });
  }

  openUpdatePriorityModal(task) {
    this.alertService
      .dynamicInputDialog({
        value: task.priority,
        inputType: InputType.SELECT,
        options: [
          { value: EmployeeTaskPriority.HIGH, label: 'High' },
          { value: EmployeeTaskPriority.MEDIUM, label: 'Medium' },
          { value: EmployeeTaskPriority.LOW, label: 'Low' },
        ],
      })
      .then((result) => {
        if (result && result != task.priority) {
          this.employeeTasksService
            .update(task.id, { priority: result })
            .subscribe(
              (response) => {
                this.alertService.toastSuccess('Updated successfully');
                task.priority = result;
              },
              (exception) => {
                this.alertService.toastError('Error updating!');
                this.authService.handleHttpError(exception);
              }
            );
        }
      });
  }


  openCreateEmployeeTaskModal(){
    const modalRef = this.modalService.open(AddEmployeeTaskModalComponent, {
      size: 'lg',
    });
    // modalRef.componentInstance.customer = this.customer;
    modalRef.result.then((result) => {
      if (result) {
        // Refresh tasks
        window.location.reload();
      }
    });
  }

  openViewEmployeeTaskModal(task: EmployeeTask) {
    const modalRef = this.modalService.open(ShowEmployeeTaskModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.taskId = task.id;
  }


  // async openUpdateNameModal(type: EmployeeTaskType) {
  //   const res: string = await this.alertService.dynamicInputDialog({
  //     value: type.name,
  //     inputType: InputType.TEXT,
  //     options: [],
  //   });

  //   if (res && res != type.name) {
  //     this.employeeTasksService
  //       .update(type.id, {
  //         name: res,
  //       })
  //       .subscribe(
  //         (response) => {
  //           this.alertService.toastSuccess('Updated successfully');
  //           type.name = res;
  //         },
  //         (exception) => {
  //           this.alertService.toastError('Error updating!');
  //           this.authService.handleHttpError(exception);
  //         }
  //       );
  //   }
  // }

  // async openUpdateDescriptionModal(type: EmployeeTaskType) {
  //   const res: string = await this.alertService.dynamicInputDialog({
  //     value: type.description,
  //     inputType: InputType.TEXT,
  //     options: [],
  //   });

  //   if (res && res != type.description) {
  //     this.employeeTasksService
  //       .update(type.id, {
  //         description: res,
  //       })
  //       .subscribe(
  //         (response) => {
  //           this.alertService.toastSuccess('Updated successfully');
  //           type.description = res;
  //         },
  //         (exception) => {
  //           this.alertService.toastError('Error updating!');
  //           this.authService.handleHttpError(exception);
  //         }
  //       );
  //   }
  // }
}
