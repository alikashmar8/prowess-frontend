import { Level1AddressesComponent } from './pages/employees/addresses/level1-addresses/level1-addresses.component';
import { EmployeeGuard } from './guards/employee-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin-guard.service';
import { AnonymousGuard } from './guards/anonymous-guard.service';
import { AuthGuard } from './guards/auth-guard.service';
import { SuperAdminGuard } from './guards/super-admin-guard.service';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AdminCompaniesComponent } from './pages/admin/companies/companies.component';
import { AdminCreateCompanyComponent } from './pages/admin/companies/create-company/create-company.component';
import { AdminEditCompanyComponent } from './pages/admin/companies/edit-company/edit-company.component';
import { AdminShowCompanyComponent } from './pages/admin/companies/show-company/show-company.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { AllEmployeesComponent } from './pages/employees/employees/all-employees/all-employees.component';
import { CollectorsComponent } from './pages/employees/employees/collectors/collectors.component';
import { ManagersComponent } from './pages/employees/employees/managers/managers.component';
import { SuperVisorsComponent } from './pages/employees/employees/super-visors/super-visors.component';
import { EmployeesHomeComponent } from './pages/employees/home/home.component';
import { CustomersComponent } from './pages/employees/customers/customers.component';
import { CreateCustomerComponent } from './pages/employees/customers/create-customer/create-customer.component';
import { PlansComponent } from './pages/employees/plans/plans.component';
import { CreatePlanComponent } from './pages/employees/plans/create-plan/create-plan.component';
import { ShowCustomerComponent } from './pages/employees/customers/show-customer/show-customer.component';
import { EditCustomerComponent } from './pages/employees/customers/edit-customer/edit-customer.component';
import { Level2AddressesComponent } from './pages/employees/addresses/level2-addresses/level2-addresses.component';
import { Level3AddressesComponent } from './pages/employees/addresses/level3-addresses/level3-addresses.component';
import { Level4AddressesComponent } from './pages/employees/addresses/level4-addresses/level4-addresses.component';
import { Level5AddressesComponent } from './pages/employees/addresses/level5-addresses/level5-addresses.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AnonymousGuard],
  },
  {
    // super admin routes
    path: 'admin',
    children: [
      {
        path: 'companies',
        children: [
          {
            path: '',
            component: AdminCompaniesComponent,
          },
          {
            path: 'create',
            component: AdminCreateCompanyComponent,
          },
          {
            path: ':id',
            component: AdminShowCompanyComponent,
          },
          {
            path: ':id/edit',
            component: AdminEditCompanyComponent,
          },
        ],
        canActivate: [SuperAdminGuard],
      },
      {
        path: 'home',
        component: AdminHomeComponent,
      },
    ],
    canActivate: [SuperAdminGuard],
  },
  {
    // company employees routes
    path: 'company',
    children: [
      {
        path: 'employees',
        children: [
          {
            path: 'all',
            component: AllEmployeesComponent,
          },
          {
            path: 'managers',
            component: ManagersComponent,
          },
          {
            path: 'super-visors',
            component: SuperVisorsComponent,
          },
          {
            path: 'collectors',
            component: CollectorsComponent,
          },
        ],
        canActivate: [AdminGuard],
      },
      {
        path: 'customers',
        children: [
          {
            path: '',
            component: CustomersComponent,
          },
          {
            path: 'create',
            component: CreateCustomerComponent,
          },
          {
            path: ':id',
            component: ShowCustomerComponent,
          },
          {
            path: ':id/edit',
            component: EditCustomerComponent,
          },
        ],
        canActivate: [EmployeeGuard],
      },
      {
        path: 'plans',
        children: [
          {
            path: '',
            component: PlansComponent,
          },
          {
            path: 'create',
            component: CreatePlanComponent,
          },
        ],
        canActivate: [EmployeeGuard],
      },
      {
        path: 'addresses',
        children: [
          {
            path: 'level1',
            component: Level1AddressesComponent,
          },
          {
            path: 'level2',
            component: Level2AddressesComponent,
          },
          {
            path: 'level3',
            component: Level3AddressesComponent,
          },
          {
            path: 'level4',
            component: Level4AddressesComponent,
          },
          {
            path: 'level5',
            component: Level5AddressesComponent,
          },
        ],
        canActivate: [EmployeeGuard],
      },
      {
        path: 'home',
        component: EmployeesHomeComponent,
        canActivate: [EmployeeGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
