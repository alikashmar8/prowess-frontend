import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { ItemsService } from 'src/app/services/items.service';
import { LoadingService } from 'src/app/services/loading.service';
import { loadingGifUrl } from 'src/constants/constants';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item-modal.component.html',
  styleUrls: ['./edit-item-modal.component.css']
})
export class EditItemModal implements OnInit {
  @Input() item: Item;
  isUpdateLoading: boolean = false;
  loadingGif = loadingGifUrl

  constructor(
    private authService: AuthService,
    private itemsService: ItemsService,
    private loadingService: LoadingService,
    public activeModal: NgbActiveModal,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if( !this.item ) {
      this.alertService.toastError('No item provided');
      this.activeModal.dismiss();
      return;
    }
  }

  async update() {
    try{
    this.isUpdateLoading = true;
    await this.itemsService.update(this.item);
    this.isUpdateLoading = false;
    this.alertService.toastSuccess('Item updated successfully');
    this.activeModal.close();
    } catch(error) {
      this.isUpdateLoading = false;
      this.authService.handleHttpError(error);
    }
  }

}
