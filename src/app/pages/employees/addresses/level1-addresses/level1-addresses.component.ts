import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteModalComponent } from 'src/app/common/modals/delete-modal/delete-modal.component';
import { EditAddressModalComponent } from 'src/app/common/modals/edit-address-modal/edit-address-modal.component';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { LoadingService } from 'src/app/services/loading.service';
import { loadingGifUrl } from 'src/constants/constants';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { Company } from 'src/models/company.model';
import { Level1Address } from 'src/models/level1-address.model';
import { Level2Address } from 'src/models/level2-address.model';
import { isAddressMaxLevel } from 'src/utils/functions';

@Component({
  selector: 'app-level1-addresses',
  templateUrl: './level1-addresses.component.html',
  styleUrls: ['./level1-addresses.component.css'],
})
export class Level1AddressesComponent implements OnInit {
  name: string;
  level2Id: string;
  isStoreLoading: boolean = false;
  loadingGifUrl: string = loadingGifUrl;
  isLoading: boolean = true;
  currentCompany: Company;
  isMaxLevel: boolean = false;

  parents: Level2Address[] = [];
  addresses: Level1Address[] = [];

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
        AddressesLevel.LEVEL1
      );
      this.parents = await this.addressesService.GetLevel2Addresses();
      this.addresses = await this.addressesService.GetLevel1Addresses();
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

    if (!this.isMaxLevel && !this.level2Id) {
      this.isStoreLoading = false;
      this.alertService.toastError(
        `${this.currentCompany.addressLevel2Name} should not be empty!`
      );
      return;
    }

    this.addressesService
      .storeLevel1({ name: this.name, parent_id: this.level2Id })
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
    modalRef.componentInstance.level = AddressesLevel.LEVEL1;
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
          this.addressesService.deleteLevel1Address(id).subscribe(
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
}
