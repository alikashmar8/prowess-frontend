import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Plan } from 'src/models/plan.model';

@Component({
  selector: 'app-edit-plan-modal',
  templateUrl: './edit-plan-modal.component.html',
  styleUrls: ['./edit-plan-modal.component.css'],
})
export class EditPlanModalComponent implements OnInit {
  @Input() plan: Plan;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
