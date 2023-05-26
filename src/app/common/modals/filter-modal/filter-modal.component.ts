import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { UserRoles } from 'src/enums/user-roles.enum';
import { Level1Address } from 'src/models/level1-address.model';
import { Level2Address } from 'src/models/level2-address.model';
import { Level3Address } from 'src/models/level3-address.model';
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css'],
})
export class FilterModalComponent implements OnInit {
  @Input() employees = [];
  @Input() plans = [];
  @Input() level5Addresses: Level5Address[] = [];
  @Input() level4Addresses: Level4Address[] = [];
  @Input() level3Addresses: Level3Address[] = [];
  @Input() level2Addresses: Level2Address[] = [];
  @Input() level1Addresses: Level1Address[] = [];
  @Input() startDateFilter: Date;
  @Input() endDateFilter: Date;
  @Input() employeeFilter = [];
  @Input() planFilter = [];
  @Input() search: string = '';
  @Input() selectedEmployee: string = '';
  @Input() selectedPlan: string = '';
  @Input() showPlansFilter: boolean = true;
  @Input() level5Address: string = '';
  @Input() level4Address: string = '';
  @Input() level3Address: string = '';
  @Input() level2Address: string = '';
  @Input() level1Address: string = '';
  // TODO: combine selected values into filters = {} object
  UserRole = UserRoles;
  currentUser: User;

  isLevel5Allowed: boolean = false;
  isLevel4Allowed: boolean = false;
  isLevel3Allowed: boolean = false;
  isLevel2Allowed: boolean = false;
  isLevel1Allowed: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private authService: AuthService,
    private addressesService: AddressesService
  ) {}

  async ngOnInit(): Promise<void> {
    this.currentUser = this.authService.currentUser;
    try {
      switch (this.currentUser.company.maxLocationLevel) {
        case AddressesLevel.LEVEL5:
          this.isLevel5Allowed = true;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level5Addresses =
            await this.addressesService.GetLevel5Addresses();
          break;
        case AddressesLevel.LEVEL4:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level4Addresses =
            await this.addressesService.GetLevel4Addresses();
          break;
        case AddressesLevel.LEVEL3:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          this.level3Addresses =
            await this.addressesService.GetLevel3Addresses();
          break;
        case AddressesLevel.LEVEL2:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = true;
          this.level2Addresses =
            await this.addressesService.GetLevel2Addresses();
          break;
        case AddressesLevel.LEVEL1:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = false;
          this.level1Addresses =
            await this.addressesService.GetLevel1Addresses();
          break;
      }
    } catch (e) {
      this.authService.handleHttpError(e);
    }
  }

  onSearch() {
    if (this.endDateFilter < this.startDateFilter) {
      this.alertService.toastError('End date must be greater than start date');
      return;
    }

    this.activeModal.close({
      search: this.search,
      selectedEmployee: this.selectedEmployee,
      selectedPlan: this.selectedPlan,
      startDateFilter: this.startDateFilter,
      endDateFilter: this.endDateFilter,
      level5Address: this.level5Address,
      level4Address: this.level4Address,
      level3Address: this.level3Address,
      level2Address: this.level2Address,
      level1Address: this.level1Address,
    });
  }

  clearFilters() {
    this.search = '';
    this.selectedEmployee = '';
    this.selectedPlan = '';
    this.startDateFilter = null;
    this.endDateFilter = null;
  }

  async level5Selected() {
    try {
      this.level4Addresses = await this.addressesService.getLevel5Children(
        this.level5Address
      );
      this.level3Addresses = [];
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.level1Address = null;
      this.level2Address = null;
      this.level3Address = null;
      this.level4Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level4Selected() {
    try {
      this.level3Addresses = await this.addressesService.getLevel4Children(
        this.level4Address
      );
      this.level2Addresses = [];
      this.level1Addresses = [];
      this.level1Address = null;
      this.level2Address = null;
      this.level3Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level3Selected() {
    try {
      this.level2Addresses = await this.addressesService.getLevel3Children(
        this.level3Address
      );
      this.level1Address = null;
      this.level2Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level2Selected() {
    try {
      this.level1Addresses = await this.addressesService.getLevel2Children(
        this.level2Address
      );
      this.level1Address = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
