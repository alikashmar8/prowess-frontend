import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './../../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeTasksService } from 'src/app/services/employee-tasks.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EmployeeTask } from 'src/models/employee-task.model';
import { AddEmployeeTaskTypeModalComponent } from './add-employee-task-type-modal/add-employee-task-type-modal.component';
import { EmployeeTaskTypesService } from 'src/app/services/employee-task-types.service';
import { EmployeeTaskType } from 'src/models/employee-task-type.model';
import { AlertService } from 'src/app/services/alert.service';
import { InputType } from 'src/enums/input-type.enum';

@Component({
  selector: 'app-employee-task-types',
  templateUrl: './employee-task-types.component.html',
  styleUrls: ['./employee-task-types.component.css'],
})
export class EmployeeTaskTypesComponent implements OnInit {
  taskTypes: EmployeeTaskType[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;
  isLoading: boolean = true;

  constructor(
    private employeeTaskTypesService: EmployeeTaskTypesService,
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
      data: EmployeeTaskType[];
      count: number;
    } = await this.employeeTaskTypesService.getAll({
      skip,
      take,
    });
    this.taskTypes = result.data;
    this.totalItems = result.count;
    // this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
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
    if (this.taskTypes?.length === this.itemsPerPage) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  openNewTaskTypeModal(): void {
    const modalRef = this.modalService.open(AddEmployeeTaskTypeModalComponent, {
      size: 'lg',
    });
    modalRef.result.then((result) => {
      if (result) {
        // Refresh tasks
        this.loadTasks();
      }
    });
  }

  deleteTaskType(task) {
    if (confirm(`Are you sure you want to delete ${task.name}?`)) {
      this.employeeTaskTypesService.delete(task.id).subscribe(
        () => {
          this.loadTasks();
        },
        (error) => {
          this.authService.handleHttpError(error);
        }
      );
    }
  }


  async openUpdateNameModal(type: EmployeeTaskType) {
    const res: string = await this.alertService.dynamicInputDialog({
      value: type.name,
      inputType: InputType.TEXT,
      options: [],
    });

    if (res && res != type.name) {
      this.employeeTaskTypesService
        .update(type.id, {
          name: res,
        })
        .subscribe(
          (response) => {
            this.alertService.toastSuccess('Updated successfully');
            type.name = res;
          },
          (exception) => {
            this.alertService.toastError('Error updating!');
            this.authService.handleHttpError(exception);
          }
        );
    }
  }


  async openUpdateDescriptionModal(type: EmployeeTaskType) {
    const res: string = await this.alertService.dynamicInputDialog({
      value: type.description,
      inputType: InputType.TEXT,
      options: [],
    });

    if (res && res != type.description) {
      this.employeeTaskTypesService
        .update(type.id, {
          description: res,
        })
        .subscribe(
          (response) => {
            this.alertService.toastSuccess('Updated successfully');
            type.description = res;
          },
          (exception) => {
            this.alertService.toastError('Error updating!');
            this.authService.handleHttpError(exception);
          }
        );
    }
  }

}
