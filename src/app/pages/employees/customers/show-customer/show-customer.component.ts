import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
import { AddressesLevel } from 'src/enums/addresses.enum';
import { User } from 'src/models/user.model';
import { handleAddresses } from 'src/utils/functions';

@Component({
  selector: 'app-show-customer',
  templateUrl: './show-customer.component.html',
  styleUrls: ['./show-customer.component.css'],
})
export class ShowCustomerComponent implements OnInit {
  isLoading: boolean = true;
  customer_id: string;
  customer: User;

  isLevel5Allowed: boolean = false;
  isLevel4Allowed: boolean = false;
  isLevel3Allowed: boolean = false;
  isLevel2Allowed: boolean = false;

  constructor(
    private loadingService: LoadingService,
    private companiesService: CompaniesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = this.loadingService.appLoading(true);
    try {
      this.customer_id = this.route.snapshot.paramMap.get('id');
      this.customer = await this.companiesService.getCustomerById(
        this.customer_id
      );
      console.log(this.customer);

      //handle address permission
      switch (this.customer.company.maxLocationLevel) {
        case AddressesLevel.LEVEL5:
          this.isLevel5Allowed = true;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
        break;
        case AddressesLevel.LEVEL4:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = true;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL3:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = true;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL2:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = true;
          break;
        case AddressesLevel.LEVEL1:
          this.isLevel5Allowed = false;
          this.isLevel4Allowed = false;
          this.isLevel3Allowed = false;
          this.isLevel2Allowed = false;
          break;
      }

      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
