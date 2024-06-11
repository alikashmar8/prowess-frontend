import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { ReceivedAmountsService } from 'src/app/services/received-amounts.service';
import { ReceivedAmount } from 'src/models/received-amount';

@Component({
  selector: 'app-list-received-amounts',
  templateUrl: './list-received-amounts.component.html',
  styleUrls: ['./list-received-amounts.component.css'],
})
export class ListReceivedAmountsComponent implements OnInit {
  receivedAmounts: ReceivedAmount[] = null;

  filters: {
    take: number;
    skip: number;
    fromDate: any;
    toDate: any;
  } = {
    take: 99,
    skip: 0,
    fromDate: new Date().toISOString(),
    toDate: new Date().toISOString(),
  };

  constructor(
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
    private receivedAmountsService: ReceivedAmountsService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.loadAmounts();
    } catch (e) {
      this.authService.handleHttpError(e);
    }
  }

  async loadAmounts() {
    try {
      this.receivedAmounts = null;
      const response = await this.receivedAmountsService.getAll(this.filters);
      this.receivedAmounts = response.data;
    } catch (e) {
      console.log(e);

      this.authService.handleHttpError(e);
    }
  }
}
