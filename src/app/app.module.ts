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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { getAccessToken } from 'src/utils/functions';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyListItemComponent } from './cards/company-list-item/company-list-item.component';
import { EmployeeListItemComponent } from './cards/employee-list-item/employee-list-item.component';
import { InvoicesListComponent } from './cards/invoices-list/invoices-list.component';
import { TabComponent } from './cards/tabs/tab/tab.component';
import { TabsComponent } from './cards/tabs/tabs/tabs.component';
import { UserListItemComponent } from './cards/user-list-item/user-list-item.component';
import { AlertComponent } from './common/alert/alert.component';
import { LoadingScreenComponent } from './common/loading-screen/loading-screen.component';
import { ConfirmationModalComponent } from './common/modals/confirmation-modal/confirmation-modal.component';
import { CustomerItemsModal } from './common/modals/customer-items-modal/customer-items-modal.component';
import { DeleteModalComponent } from './common/modals/delete-modal/delete-modal.component';
import { EditAddressModalComponent } from './common/modals/edit-address-modal/edit-address-modal.component';
import { EditPlanModalComponent } from './common/modals/edit-plan-modal/edit-plan-modal.component';
import { EnableDisableUserComponent } from './common/modals/enable-disable-user/enable-disable-user.component';
import { RenewUserModalComponent } from './common/modals/renew-user-modal/renew-user-modal.component';
import { ShowEmployeeModal } from './common/modals/show-employee-modal/show-employee-modal.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';
import { AdminCompaniesComponent } from './pages/admin/companies/companies.component';
import { AdminCreateCompanyComponent } from './pages/admin/companies/create-company/create-company.component';
import { AdminEditCompanyComponent } from './pages/admin/companies/edit-company/edit-company.component';
import { AdminShowCompanyComponent } from './pages/admin/companies/show-company/show-company.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { Level1AddressesComponent } from './pages/employees/addresses/level1-addresses/level1-addresses.component';
import { Level2AddressesComponent } from './pages/employees/addresses/level2-addresses/level2-addresses.component';
import { Level3AddressesComponent } from './pages/employees/addresses/level3-addresses/level3-addresses.component';
import { Level4AddressesComponent } from './pages/employees/addresses/level4-addresses/level4-addresses.component';
import { Level5AddressesComponent } from './pages/employees/addresses/level5-addresses/level5-addresses.component';
import { CreateCustomerComponent } from './pages/employees/customers/create-customer/create-customer.component';
import { CustomersComponent } from './pages/employees/customers/customers.component';
import { EditCustomerComponent } from './pages/employees/customers/edit-customer/edit-customer.component';
import { ShowCustomerComponent } from './pages/employees/customers/show-customer/show-customer.component';
import { AllEmployeesComponent } from './pages/employees/employees/all-employees/all-employees.component';
import { CollectorsComponent } from './pages/employees/employees/collectors/collectors.component';
import { CreateEmployeeComponent } from './pages/employees/employees/create-employee/create-employee.component';
import { ManagersComponent } from './pages/employees/employees/managers/managers.component';
import { SuperVisorsComponent } from './pages/employees/employees/super-visors/super-visors.component';
import { EmployeesHomeComponent } from './pages/employees/home/home.component';
import { CreateInvoiceComponent } from './pages/employees/invoices/create-invoice/create-invoice.component';
import { ShowInvoiceComponent } from './pages/employees/invoices/show-invoice/show-invoice.component';
import { ThisMonthInvoicesComponent } from './pages/employees/invoices/this-month-invoices/this-month-invoices.component';
import { UnpaidInvoicesComponent } from './pages/employees/invoices/unpaid-invoices/unpaid-invoices.component';
import { CreateItemComponent } from './pages/employees/items/create-item/create-item.component';
import { ItemsComponent } from './pages/employees/items/items.component';
import { CreatePlanComponent } from './pages/employees/plans/create-plan/create-plan.component';
import { PlansComponent } from './pages/employees/plans/plans.component';
import { CreateItemInvoiceModal } from './common/modals/create-item-invoice-modal/create-item-invoice-modal.component';

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
    Level1AddressesComponent,
    Level2AddressesComponent,
    Level3AddressesComponent,
    Level4AddressesComponent,
    Level5AddressesComponent,
    EditAddressModalComponent,
    CreateEmployeeComponent,
    RenewUserModalComponent,
    UnpaidInvoicesComponent,
    InvoicesListComponent,
    ShowInvoiceComponent,
    CreateInvoiceComponent,
    ThisMonthInvoicesComponent,
    ConfirmationModalComponent,
    ItemsComponent,
    CreateItemComponent,
    ShowEmployeeModal,
    EditPlanModalComponent,
    CustomerItemsModal,
    CreateItemInvoiceModal,
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
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
