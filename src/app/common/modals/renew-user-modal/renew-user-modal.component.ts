import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  COLLECTOR_RENEW_AMOUNT,
  MANAGER_RENEW_AMOUNT,
  SUPERVISOR_RENEW_AMOUNT
} from 'src/constants/constants';
import { UserRoles } from 'src/enums/user-roles.enum';

@Component({
  selector: 'app-renew-user-modal',
  templateUrl: './renew-user-modal.component.html',
  styleUrls: ['./renew-user-modal.component.css'],
})
export class RenewUserModalComponent implements OnInit {
  @Input() userRole: UserRoles;

  amountToDeduct: number = 0;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    switch (this.userRole) {
      case UserRoles.MANAGER:
        this.amountToDeduct = MANAGER_RENEW_AMOUNT;
        break;
      case UserRoles.SUPERVISOR:
        this.amountToDeduct = SUPERVISOR_RENEW_AMOUNT;
        break;
      case UserRoles.COLLECTOR:
        this.amountToDeduct = COLLECTOR_RENEW_AMOUNT;
        break;
    }
  }
}
