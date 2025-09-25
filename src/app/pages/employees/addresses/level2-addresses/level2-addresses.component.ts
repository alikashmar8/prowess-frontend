import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from 'src/app/common/modals/delete-modal/delete-modal.component';
import { EditAddressModalComponent } from 'src/app/common/modals/edit-address-modal/edit-address-modal.component';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { loadingGifUrl } from 'src/constants/constants';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { Company } from 'src/models/company.model';
import { Level2Address } from 'src/models/level2-address.model';
import { Level3Address } from 'src/models/level3-address.model';
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
import { isAddressMaxLevel } from 'src/utils/functions';

@Component({
  selector: 'app-level2-addresses',
  templateUrl: './level2-addresses.component.html',
  styleUrls: ['./level2-addresses.component.css'],
})
export class Level2AddressesComponent implements OnInit {
  name: string;
  isStoreLoading: boolean = false;
  loadingGifUrl: string = loadingGifUrl;
  isLoading: boolean = true;
  currentCompany: Company;
  isMaxLevel: boolean = false;

  parents: Level3Address[] = [];
  addresses: Level2Address[] = [];

  level5Addresses: Level5Address[] = [];
  level4Addresses: Level4Address[] = [];
  level3Addresses: Level3Address[] = [];
  isLevel5Allowed: boolean = false;
  isLevel4Allowed: boolean = false;
  isLevel3Allowed: boolean = false;
  isLevel2Allowed: boolean = false;

  selectedLevel5Id: string;
  selectedLevel4Id: string;
  selectedLevel3Id: string;

  constructor(
    private addressesService: AddressesService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      this.currentCompany = this.authService.currentUser.company;
      this.isMaxLevel = isAddressMaxLevel(
        this.currentCompany.maxLocationLevel,
        AddressesLevel.LEVEL2
      );
      if (!this.isMaxLevel) {
        switch (this.currentCompany.maxLocationLevel) {
          case AddressesLevel.LEVEL5:
            this.isLevel5Allowed = true;
            this.isLevel4Allowed = true;
            this.isLevel3Allowed = true;
            this.level5Addresses =
              await this.addressesService.GetLevel5Addresses();
            break;
          case AddressesLevel.LEVEL4:
            this.isLevel5Allowed = false;
            this.isLevel4Allowed = true;
            this.isLevel3Allowed = true;
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
        }
      }
      this.parents = await this.addressesService.GetLevel3Addresses();
      if (this.isMaxLevel)
        this.addresses = await this.addressesService.GetLevel2Addresses();
      this.isLoading = false;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  store() {
    this.isStoreLoading = true;
    if (!this.name) {
      this.alertService.toastError('Name should not be empty!');
      this.isStoreLoading = false;
      return;
    }

    if (!this.isMaxLevel && !this.selectedLevel3Id) {
      this.isStoreLoading = false;
      this.alertService.toastError(
        `${this.currentCompany.addressLevel3Name} should not be empty!`
      );
      return;
    }

    this.addressesService
      .storeLevel2({ name: this.name, parent_id: this.selectedLevel3Id })
      .subscribe(
        (res) => {
          this.alertService.toastSuccess('Address added successfully');
          this.name = '';
          this.isStoreLoading = false;
        },
        (err) => {
          this.authService.handleHttpError(err);
          this.isStoreLoading = false;
        }
      );
  }

  openEditAddressModal(id: string) {
    const modalRef = this.modalService.open(EditAddressModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.level = AddressesLevel.LEVEL2;
    modalRef.result.then(
      (result) => {
        window.location.reload();
      },
      (rejected) => {}
    );
  }

  openDeleteModal(id: string, name: string) {
    const modalRef = this.modalService.open(DeleteModalComponent);
    modalRef.componentInstance.name = name;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.addressesService.deleteLevel2Address(id).subscribe(
            (result: any) => {
              if (result.affected > 0) {
                this.alertService.toastSuccess('Address deleted successfully');
                window.location.reload();
              } else {
                this.alertService.toastError('Error deleting address');
              }
            },
            (error) => {
              this.authService.handleHttpError(error);
            }
          );
        }
      },
      (rejected) => {}
    );
  }

  async level5Selected() {
    try {
      this.level4Addresses = await this.addressesService.getLevel5Children(
        this.selectedLevel5Id
      );
      this.level3Addresses = [];
      this.level4Addresses = [];
      this.selectedLevel4Id = null;
      this.selectedLevel3Id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level4Selected() {
    try {
      this.level3Addresses = await this.addressesService.getLevel4Children(
        this.selectedLevel4Id
      );
      this.selectedLevel3Id = null;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  async level3Selected() {
    if (!this.selectedLevel3Id) {
      this.addresses = [];
      return;
    }
    try {
      this.addresses = await this.addressesService.getLevel3Children(
        this.selectedLevel3Id
      );
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
