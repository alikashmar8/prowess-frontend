import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordModal } from 'src/app/common/modals/change-password-modal/change-password-modal.component';
import { AuthService } from 'src/app/services/auth-service.service';
import { User } from 'src/models/user.model';
import { setLang } from 'src/utils/functions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private ngbModal: NgbModal,
    public translate: TranslateService
  ) {}

  user: User;

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  openChangePasswordModal() {
    const modalRef = this.ngbModal.open(ChangePasswordModal, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.user = this.user;

    modalRef.result.then((result) => {});
  }

  switchLang(language: string) {
    this.translate.use(language);
    setLang(language);
  }
}
