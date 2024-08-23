import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { EmployeeTaskTypesService } from 'src/app/services/employee-task-types.service';

@Component({
  selector: 'app-add-employee-task-type-modal',
  templateUrl: './add-employee-task-type-modal.component.html',
  styleUrls: ['./add-employee-task-type-modal.component.css'],
})
export class AddEmployeeTaskTypeModalComponent implements OnInit {
  taskTypeForm: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private employeeTaskTypesService: EmployeeTaskTypesService,
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
    this.employeeTaskTypesService.create(this.taskTypeForm.value).subscribe(
      () => {
        this.alertService.success('Task type created successfully!');
        this.activeModal.close(true);
      },
      (error) => {
        this.authService.handleHttpError(error);
      }
    );
  }
}
