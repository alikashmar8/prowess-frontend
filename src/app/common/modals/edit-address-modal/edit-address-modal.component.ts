import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressesService } from 'src/app/services/addresses.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { loadingGifUrl } from 'src/constants/constants';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { isAddressMaxLevel } from 'src/utils/functions';

@Component({
  selector: 'app-edit-address-modal',
  templateUrl: './edit-address-modal.component.html',
  styleUrls: ['./edit-address-modal.component.css'],
})
export class EditAddressModalComponent implements OnInit {
  @Input() id: string;
  @Input() level: AddressesLevel;

  address: any;
  isLoading: boolean = true;
  isMaxLevel: boolean = true;
  parents: any[] = [];
  isUpdateLoading: boolean = false;
  loadingGif: string = loadingGifUrl;

  constructor(
    public activeModal: NgbActiveModal,
    private addressesService: AddressesService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.isLoading = true;

      switch (this.level) {
        case AddressesLevel.LEVEL1:
          this.address = await this.addressesService.getLevel1AddressById(
            this.id
          );
          this.isMaxLevel = isAddressMaxLevel(
            this.authService.currentUser.company.maxLocationLevel,
            AddressesLevel.LEVEL1
          );
          this.parents = await this.addressesService.GetLevel2Addresses();
          break;
        case AddressesLevel.LEVEL2:
          this.address = await this.addressesService.getLevel2AddressById(
            this.id
          );
          this.parents = await this.addressesService.GetLevel3Addresses();
          this.isMaxLevel = isAddressMaxLevel(
            this.authService.currentUser.company.maxLocationLevel,
            AddressesLevel.LEVEL2
          );

          break;
        case AddressesLevel.LEVEL3:
          this.address = await this.addressesService.getLevel3AddressById(
            this.id
          );
          this.parents = await this.addressesService.GetLevel4Addresses();
          this.isMaxLevel = isAddressMaxLevel(
            this.authService.currentUser.company.maxLocationLevel,
            AddressesLevel.LEVEL3
          );
          break;
        case AddressesLevel.LEVEL4:
          this.address = await this.addressesService.getLevel4AddressById(
            this.id
          );
          this.parents = await this.addressesService.GetLevel5Addresses();
          this.isMaxLevel = isAddressMaxLevel(
            this.authService.currentUser.company.maxLocationLevel,
            AddressesLevel.LEVEL4
          );
          break;
        case AddressesLevel.LEVEL5:
          this.address = await this.addressesService.getLevel5AddressById(
            this.id
          );
          this.isMaxLevel = isAddressMaxLevel(
            this.authService.currentUser.company.maxLocationLevel,
            AddressesLevel.LEVEL5
          );
          break;
      }
      this.isLoading = false;
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }

  update() {
    this.isUpdateLoading = true;

    if (!this.address.name) {
      this.alertService.toastError('Name should be not empty');
      this.isUpdateLoading = false;
      return;
    }
    if (!this.isMaxLevel && !this.address.parent_id) {
      this.alertService.toastError('Parent address should not be empty');
      this.isUpdateLoading = false;
      return;
    }

    this.addressesService.update(this.id, this.address, this.level).subscribe(
      (result: any) => {
        if (result.affected > 0) {
          this.alertService.toastSuccess('Update successful');
          this.activeModal.close(true);
        } else {
          this.alertService.toastError('Error updating Address');
        }
      },
      (err) => {
        this.authService.handleHttpError(err);
        this.isUpdateLoading = false
      }
    );
  }
}
