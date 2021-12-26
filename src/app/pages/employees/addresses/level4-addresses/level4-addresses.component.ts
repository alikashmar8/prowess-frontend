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
import { Level4Address } from 'src/models/level4-address.model';
import { Level5Address } from 'src/models/level5-address.model';
import { isAddressMaxLevel } from 'src/utils/functions';

@Component({
  selector: 'app-level4-addresses',
  templateUrl: './level4-addresses.component.html',
  styleUrls: ['./level4-addresses.component.css'],
})
export class Level4AddressesComponent implements OnInit {
  name: string;
  level5Id: string;
  isStoreLoading: boolean = false;
  loadingGifUrl: string = loadingGifUrl;
  isLoading: boolean = true;
  currentCompany: Company;

  parents: Level5Address[] = [];
  addresses: Level4Address[] = [];
  isMaxLevel: boolean;

  constructor(
    private addressesService: AddressesService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private modalService: NgbModal,
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      this.currentCompany = this.authService.currentUser.company;
      this.parents = await this.addressesService.GetLevel5Addresses();
      this.addresses = await this.addressesService.GetLevel4Addresses();
      this.isMaxLevel = isAddressMaxLevel(
        this.currentCompany.maxLocationLevel,
        AddressesLevel.LEVEL4
      );
      this.isLoading = false;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  store() {
    if (!this.name) {
      this.alertService.toastError('Name should not be empty!');
      return;
    }

    if (!this.isMaxLevel && !this.level5Id) {
      this.alertService.toastError(
        `${this.currentCompany.addressLevel5Name} should not be empty!`
      );
      return;
    }

    this.addressesService
      .storeLevel4({ name: this.name, parent_id: this.level5Id })
      .subscribe((res) => {
        this.alertService.toastSuccess('Address added successfully');
        this.name = '';
      });
  }

  openEditAddressModal(id: string) {
    const modalRef = this.modalService.open(EditAddressModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.level = AddressesLevel.LEVEL4;
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
          this.addressesService.deleteLevel4Address(id).subscribe(
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
