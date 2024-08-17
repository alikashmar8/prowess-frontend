import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { EmployeeTasksService } from 'src/app/services/employee-tasks.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EmployeeTask } from 'src/models/employee-task.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-show-employee-task-modal',
  templateUrl: './show-employee-task-modal.component.html',
  styleUrls: ['./show-employee-task-modal.component.css'],
})
export class ShowEmployeeTaskModalComponent implements OnInit {
  @Input() taskId: string;
  currentUser: User;
  isLoading: boolean = true;
  task: EmployeeTask;

  constructor(
    public activeModal: NgbActiveModal,
    private employeeTasksService: EmployeeTasksService,
    private authService: AuthService,
    private alertService: AlertService,
    private loadingService: LoadingService
  ) {}
  async ngOnInit(): Promise<void> {
    if (!this.taskId) {
      this.alertService.error('Error, missing data');
      this.activeModal.dismiss();
    }
    this.isLoading = true;
    try {
      this.task = await this.employeeTasksService.getById(this.taskId);
    } catch (error) {
      this.authService.handleHttpError(error);
      this.activeModal.dismiss();
    }
    this.isLoading = false;
  }
}
