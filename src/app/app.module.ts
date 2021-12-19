import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import {
  ConfirmBoxConfigModule,
  DialogConfigModule,
  NgxAwesomePopupModule,
  ToastNotificationConfigModule
} from '@costlydeveloper/ngx-awesome-popup';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { getAccessToken } from 'src/utils/functions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyListItemComponent } from './cards/company-list-item/company-list-item.component';
import { EmployeeListItemComponent } from './cards/employee-list-item/employee-list-item.component';
import { TabComponent } from './cards/tabs/tab/tab.component';
import { TabsComponent } from './cards/tabs/tabs/tabs.component';
import { UserListItemComponent } from './cards/user-list-item/user-list-item.component';
import { AlertComponent } from './common/alert/alert.component';
import { LoadingScreenComponent } from './common/loading-screen/loading-screen.component';
import { DeleteModalComponent } from './common/modals/delete-modal/delete-modal.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AdminCompaniesComponent } from './pages/admin/companies/companies.component';
import { AdminCreateCompanyComponent } from './pages/admin/companies/create-company/create-company.component';
import { AdminEditCompanyComponent } from './pages/admin/companies/edit-company/edit-company.component';
import { AdminShowCompanyComponent } from './pages/admin/companies/show-company/show-company.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { CustomersComponent } from './pages/employees/customers/customers.component';
import { AllEmployeesComponent } from './pages/employees/employees/all-employees/all-employees.component';
import { CollectorsComponent } from './pages/employees/employees/collectors/collectors.component';
import { ManagersComponent } from './pages/employees/employees/managers/managers.component';
import { SuperVisorsComponent } from './pages/employees/employees/super-visors/super-visors.component';
import { EmployeesHomeComponent } from './pages/employees/home/home.component';
import { CreateCustomerComponent } from './pages/employees/customers/create-customer/create-customer.component';
import { PlansComponent } from './pages/employees/plans/plans.component';
import { CreatePlanComponent } from './pages/employees/plans/create-plan/create-plan.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { EditCustomerComponent } from './pages/employees/customers/edit-customer/edit-customer.component';
import { ShowCustomerComponent } from './pages/employees/customers/show-customer/show-customer.component';
import { EnableDisableUserComponent } from './common/modals/enable-disable-user/enable-disable-user.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AdminCompaniesComponent,
    LoginComponent,
    LoadingScreenComponent,
    AlertComponent,
    AdminCreateCompanyComponent,
    CompanyListItemComponent,
    AdminShowCompanyComponent,
    AdminEditCompanyComponent,
    TabComponent,
    TabsComponent,
    UserListItemComponent,
    AdminHomeComponent,
    DeleteModalComponent,
    ManagersComponent,
    SuperVisorsComponent,
    CollectorsComponent,
    CustomersComponent,
    AllEmployeesComponent,
    EmployeesHomeComponent,
    EmployeeListItemComponent,
    CreateCustomerComponent,
    PlansComponent,
    CreatePlanComponent,
    EditCustomerComponent,
    ShowCustomerComponent,
    EnableDisableUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: getAccessToken,
        allowedDomains: ['*'],
        disallowedRoutes: [],
      },
    }),
    NgxAwesomePopupModule.forRoot(), // Essential, mandatory main module.
    DialogConfigModule.forRoot(), // Needed for instantiating dynamic components.
    ConfirmBoxConfigModule.forRoot(), // Needed for instantiating confirm boxes.
    ToastNotificationConfigModule.forRoot(), // Needed for instantiating toast notifications.
    Ng2SearchPipeModule,
    MatTabsModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
