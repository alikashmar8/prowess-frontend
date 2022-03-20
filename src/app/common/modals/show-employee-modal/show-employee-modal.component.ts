import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user.model';

@Component({
  selector: 'app-show-employee-modal',
  templateUrl: './show-employee-modal.component.html',
  styleUrls: ['./show-employee-modal.component.css'],
})
export class ShowEmployeeModal implements OnInit {
  @Input() employee: User;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
