import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordModal } from 'src/app/common/modals/change-password-modal/change-password-modal.component';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth-service.service';
import { CommonService } from 'src/app/services/common.service';
import { User } from 'src/models/user.model';
import { setLang } from 'src/utils/functions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isImporting: boolean = false;
  constructor(
    private authService: AuthService,
    private ngbModal: NgbModal,
    public translate: TranslateService,
    private commonService: CommonService,
    private alertService: AlertService
  ) {}

  user: User;
  file: any;

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

  uploadImage(event: any) {
    this.file = event.target.files[0];
    console.log(this.file);
  }

  uploadExcel() {
    this.isImporting = true;

    if (!this.file) {
      this.alertService.toastError(
        'Please select an excel file before you proceed!'
      );
      this.isImporting = false;
    }
    let data = new FormData();
    data.append('file', this.file, this.file.name);

    this.commonService.uploadExcel(data).subscribe(
      (res: any) => {
        if (res.success) {
          this.alertService.toastSuccess('Import Done Successfully');
          this.isImporting = false;
        }
      },
      (err) => {
        this.authService.handleHttpError(err);
      }
    );
  }
}
