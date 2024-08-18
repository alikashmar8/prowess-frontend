import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { EmployeeTaskTypesService } from 'src/app/services/employee-task-types.service';
import { EmployeeTasksService } from 'src/app/services/employee-tasks.service';
import { LoadingService } from 'src/app/services/loading.service';
import { EmployeeTaskCategory } from 'src/enums/employee-task-category.enum';
import { EmployeeTaskPriority } from 'src/enums/employee-task-priority.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { EmployeeTaskType } from 'src/models/employee-task-type.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-add-employee-task-modal',
  templateUrl: './add-employee-task-modal.component.html',
  styleUrls: ['./add-employee-task-modal.component.css'],

  encapsulation: ViewEncapsulation.None,
})
export class AddEmployeeTaskModalComponent implements OnInit {
  currentUser: User;
  taskForm: FormGroup;
  employees: User[];
  taskTypes: EmployeeTaskType[];
  isLoading: boolean = true;
  take: number = 15;
  skip: number = 0;
  customers: User[] = [];
  selectedCustomerId: string = null;
  supportingEmployeesIds: string[] = [];

  // /** list of customers */
  // protected customers: User[] = [];

  // /** control for the selected customer */
  // public customerCtrl: FormControl<User> = new FormControl<User>(null);

  // /** control for the MatSelect filter keyword */
  // public customerFilterCtrl: FormControl<string> = new FormControl<string>('');

  // /** list of customers filtered by search keyword */
  // public filteredCustomers: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  UserRoles = UserRoles;
  EmployeeTaskCategory = EmployeeTaskCategory;
  EmployeeTaskPriority = EmployeeTaskPriority;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private employeeTasksService: EmployeeTasksService,
    private employeeTaskTypesService: EmployeeTaskTypesService,
    private authService: AuthService,
    private alertService: AlertService,
    private companiesService: CompaniesService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = this.loadingService.appLoading(true);
      this.filterCustomers('');

      // listen for search field value changes
      // this.customerFilterCtrl.valueChanges
      // .subscribe(() => {
      //   this.filterCustomers('');
      // });
      this.currentUser = this.authService.currentUser;
      this.taskForm = this.fb.group({
        category: [EmployeeTaskCategory.GENERAL, Validators.required],
        priority: [EmployeeTaskPriority.MEDIUM, Validators.required],
        taskTypeId: [null, Validators.required],
        employeeId: ['', Validators.nullValidator],
        customerId: [null],
        description: ['', Validators.nullValidator],
        // supportingEmployees: [[], Validators.nullValidator],
      });

      this.companiesService
        .getCompanyEmployees(this.authService.currentUser.company_id)
        .subscribe(
          async (result: any) => {
            this.employees = result;
            this.taskTypes = (
              await this.employeeTaskTypesService.getAll({
                skip: 0,
                take: 50,
              })
            ).data;
            this.isLoading = this.loadingService.appLoading(false);
          },
          (error) => {
            this.authService.handleHttpError(error);
          }
        );
    } catch (e) {
      this.authService.handleHttpError(e);
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }

    if (
      !this.selectedCustomerId &&
      this.taskForm.value.category === EmployeeTaskCategory.CUSTOMER
    ) {
      this.alertService.error('Please select a customer');
      return;
    }

    this.taskForm.value.customerId = this.selectedCustomerId;

    this.taskForm.value.supportingEmployees = this.supportingEmployeesIds.map(id => ({ employeeId: id }));
    // this.alertService.toastSuccess(JSON.stringify(this.taskForm.value.supportingEmployees));
    // return;

    this.employeeTasksService.create(this.taskForm.value).subscribe(
      () => {
        this.alertService.success('Task created successfully!');
        this.activeModal.close(true);2
      },
      (error) => {
        this.authService.handleHttpError(error);
      }
    );
  }

  filterCustomers(event) {
    // console.log("event.value", event?.target?.value);

    // console.log('this.taskForm.value.customerId');
    // console.log(this.taskForm?.value?.customerId);
    // console.log(this.selectedCustomerId);

    // event = this.customerFilterCtrl?.value;

    this.companiesService
      .getCompanyCustomers(
        this.authService.currentUser.company_id,
        this.take,
        this.skip,
        {
          search: event?.target?.value,
        }
      )
      .subscribe(
        (result: any) => {
          this.customers = result.data;
          // console.log(this.customers);
          // this.filteredCustomers.next(this.customers);
          // console.log(this.filteredCustomers);

          // load the initial customer list
          // this.filteredCustomers.next(this.customers);

          // this.totalRecords = result.count;
          // this.totalPages =
          //   result.count > 0 ? Math.ceil(result.count / this.take) : 1;
        },
        (err) => {
          this.authService.handleHttpError(err);
        }
      );
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
}
