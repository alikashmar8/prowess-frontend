import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRoles } from 'src/enums/user-roles.enum';
import { User } from './../../../../models/user.model';
import { AuthService } from './../../../services/auth-service.service';

@Component({
  selector: 'app-renew-user-modal',
  templateUrl: './renew-user-modal.component.html',
  styleUrls: ['./renew-user-modal.component.css'],
})
export class RenewUserModalComponent implements OnInit {
  @Input() userRole: UserRoles;
  currentUser: User;

  amountToDeduct: number = 0;
  constructor(
    public activeModal: NgbActiveModal,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    switch (this.userRole) {
      case UserRoles.MANAGER:
        this.amountToDeduct = this.currentUser.company.managerAccountPrice;
        break;
      case UserRoles.SUPERVISOR:
        this.amountToDeduct = this.currentUser.company.supervisorAccountPrice;
        break;
      case UserRoles.COLLECTOR:
        this.amountToDeduct = this.currentUser.company.collectorAccountPrice;
        break;
    }
  }
}
