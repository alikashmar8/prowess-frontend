import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { ItemsService } from 'src/app/services/items.service';
import { LoadingService } from 'src/app/services/loading.service';
import { loadingGifUrl } from 'src/constants/constants';
import { CreateItemDTO } from 'src/dtos/create-item.dto';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css'],
})
export class CreateItemComponent implements OnInit {
  isLoading: boolean = true;
  isStoreLoading: boolean = false;
  loadingGif = loadingGifUrl;
  item: CreateItemDTO = {
    name: null,
    price: null,
    quantity: null,
    company_id: null,
  };

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private alertService: AlertService,
    private itemsService: ItemsService
  ) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.appLoading(false);
  }

  store() {
    this.isStoreLoading = true;
    if (!this.item.name || !this.item.price) {
      this.alertService.toastError(
        'Please make sure name and price are set correctly'
      );
      this.isStoreLoading = false;
      return;
    }

    if (!this.authService.currentUser.company_id) {
      this.alertService.toastError('You are not employee in a company');
      this.isStoreLoading = false;
      return;
    }

    this.item.company_id = this.authService.currentUser.company_id;

    this.itemsService.store(this.item).subscribe(
      (res) => {
        this.item.name = null;
        this.item.price = null;
        this.item.company_id = null;
        this.isStoreLoading = false;
        this.alertService.toastSuccess('item added successfully');
      },
      (err) => {
        this.authService.handleHttpError(err);
      }
    );
  }
}
