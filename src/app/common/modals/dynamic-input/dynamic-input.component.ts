import { Component, Inject, OnInit } from '@angular/core';
import { DialogBelonging } from '@costlydeveloper/ngx-awesome-popup';
import { Subscription } from 'rxjs';
import { InputType } from 'src/enums/input-type.enum';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.css'],
})
export class DynamicInputComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();
  InputType = InputType;
  passedData: {
    label?: string;
    value: string;
    inputType: InputType;
    options?: {
      label: string;
      value: string;
    }[];
  };
  file: any;

  // Dependency Injection of the dialogBelonging in constructor is crucial.
  constructor(
    @Inject('dialogBelonging') public dialogBelonging: DialogBelonging
  ) {}

  ngOnInit(): void {
    // Check received data and other available features.
    this.passedData = this.dialogBelonging.customData;
    console.log(this.passedData);

    // Subscribe to button listeners.
    this.subscriptions.add(
      // IDialogEventsController
      this.dialogBelonging.eventsController.onButtonClick$.subscribe(
        (_Button) => {
          if (_Button.ID === 'submit') {
            // return this.passedData.value;
            this.dialogBelonging.eventsController.close(
              this.passedData.inputType != InputType.IMAGE
                ? this.passedData.value
                : this.file
            );
          } else if (_Button.ID === 'cancel') {
            // Do some logic and close popup.
            this.dialogBelonging.eventsController.close();
          }
        }
      )
    );

    // Timeout emulates async data.
    setTimeout(() => {
      // Close the loader after some data is ready.
      // IDialogEventsController
      this.dialogBelonging.eventsController.closeLoader();
    }, 1000);
  }

  ngOnDestroy(): void {
    // Care about memory and close all subscriptions.
    this.subscriptions.unsubscribe();
  }

  uploadImage(event: any) {
    this.file = event.target.files[0];
  }
}
