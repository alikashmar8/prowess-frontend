import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditItemModal } from 'src/app/common/modals/edit-item-modal/edit-item-modal.component';
import { AuthService } from 'src/app/services/auth-service.service';
import { ItemsService } from 'src/app/services/items.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  isLoading: boolean = true;
  items: Item[] = [];

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private ngbModal: NgbModal
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(true);
    this.itemsService
      .getCompanyItems(this.authService.currentUser.company_id)
      .subscribe((result: Item[]) => {
        this.items = result;
        this.isLoading = this.loadingService.appLoading(false);
      });
  }

  openEditItemModal(item: Item) {
    const modalRef = this.ngbModal.open(EditItemModal);
    modalRef.componentInstance.item = item;
    modalRef.result
      .then(
        (result) => {},
        (rejected) => {}
      )
      .catch();
  }

  async updateStatus(item: Item, status: boolean) {
    this.itemsService.updateStatus(item.id, status).subscribe(
      (result: Item[]) => {
        item.isActive = status;
      },
      (error) => {
        this.authService.handleHttpError(error);
      }
    );
  }
}
