import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { LoadingService } from 'src/app/services/loading.service';
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

  isCountryAllowed: boolean = false;
  isDistrictAllowed: boolean = false;
  isCityAllowed: boolean = false;
  isAreaAllowed: boolean = false;
  isStreetAllowed: boolean = false;
  isBuildingAllowed: boolean = false;

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
      let res = handleAddresses(this.customer.company.maxLocationToEnter);
      this.isCountryAllowed = res.isCountryAllowed;
      this.isDistrictAllowed = res.isDistrictAllowed;
      this.isCityAllowed = res.isCityAllowed;
      this.isAreaAllowed = res.isAreaAllowed;
      this.isStreetAllowed = res.isStreetAllowed;
      this.isBuildingAllowed = res.isBuildingAllowed;

      this.isLoading = this.loadingService.appLoading(false);
    } catch (err) {
      this.authService.handleHttpError(err);
    }
  }
}
