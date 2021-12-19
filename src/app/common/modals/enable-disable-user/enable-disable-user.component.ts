import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enable-disable-user',
  templateUrl: './enable-disable-user.component.html',
  styleUrls: ['./enable-disable-user.component.css'],
})
export class EnableDisableUserComponent implements OnInit {
  @Input() userName: string;
  @Input() isActive: boolean;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
