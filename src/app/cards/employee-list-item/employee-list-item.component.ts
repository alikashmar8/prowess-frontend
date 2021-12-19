import { User } from './../../../models/user.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-list-item',
  templateUrl: './employee-list-item.component.html',
  styleUrls: ['./employee-list-item.component.css'],
})
export class EmployeeListItemComponent implements OnInit {
  @Input() employee: User;

  constructor() {}

  ngOnInit(): void {
  }
}
