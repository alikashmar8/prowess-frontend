import { Component, OnInit } from '@angular/core';
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
    private itemsService: ItemsService
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
}
