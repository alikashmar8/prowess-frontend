import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { EmployeeTaskReasonsService } from 'src/app/services/employee-task-reasons.service';

@Component({
  selector: 'app-add-employee-task-reason-modal',
  templateUrl: './add-employee-task-reason-modal.component.html',
  styleUrls: ['./add-employee-task-reason-modal.component.css'],
})
export class AddEmployeeTaskReasonModalComponent implements OnInit {
  taskTypeForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private employeeTaskReasonsService: EmployeeTaskReasonsService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.taskTypeForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
    });
  }

  onSubmit(): void {
    this.employeeTaskReasonsService.create(this.taskTypeForm.value).subscribe(
      () => {
        this.alertService.success('Task reason created successfully!');
        this.activeModal.close(true);
      },
      (error) => {
        this.authService.handleHttpError(error);
      }
    );
  }
}
