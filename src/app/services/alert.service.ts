import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  ButtonLayoutDisplay,
  ButtonMaker,
  DialogInitializer,
  DialogLayoutDisplay,
  ToastNotificationInitializer
} from '@costlydeveloper/ngx-awesome-popup';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { InputType } from 'src/enums/input-type.enum';
import { DynamicInputComponent } from '../common/modals/dynamic-input/dynamic-input.component';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterRouteChange = false;

  constructor(private router: Router) {
    // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          // only keep for a single route change
          this.keepAfterRouteChange = false;
        } else {
          // clear alert custom-message.ts
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  success(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterRouteChange = false) {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({ type: 'error', text: message });
  }

  clear() {
    // clear by calling subject.next() without parameters
    this.subject.next(true);
  }

  toastNotification(
    message: string,
    type: DialogLayoutDisplay,
    title?: string
  ) {
    const newToastNotification = new ToastNotificationInitializer();

    newToastNotification.setMessage(message);
    newToastNotification.setConfig({
      layoutType: type, // SUCCESS | INFO | NONE | DANGER | WARNING
    });

    if (title) {
      newToastNotification.setTitle(title);
    }
    newToastNotification.openToastNotification$();
  }

  toastError(message: string, title?: string) {
    this.toastNotification(message, DialogLayoutDisplay.DANGER, title);
  }

  toastSuccess(message: string, title?: string) {
    this.toastNotification(message, DialogLayoutDisplay.SUCCESS, title);
  }

  async dynamicInputDialog(defaultData: {
    label?: any;
    value: any;
    inputType: InputType;
    options?: { label: string; value: string }[];
  }) {
    // Instance of DialogInitializer includes any valid angular component as argument.
    const dialogPopup = new DialogInitializer(DynamicInputComponent);

    // Any data can be sent to AnyAngularComponent.
    dialogPopup.setCustomData(defaultData); // optional

    // Set some configuration.
    dialogPopup.setConfig({
      width: '500px',
      layoutType: DialogLayoutDisplay.NONE, // SUCCESS | INFO | NONE | DANGER | WARNING
    });

    // Set some custom buttons as list.
    // SUCCESS | INFO | NONE | DANGER | WARNING | PRIMARY | SECONDARY | LINK | DARK | LIGHT
    dialogPopup.setButtons([
      new ButtonMaker('Submit', 'submit', ButtonLayoutDisplay.SUCCESS),
      new ButtonMaker('Cancel', 'cancel', ButtonLayoutDisplay.SECONDARY),
    ]);

    // Simply open the popup and observe which button is clicked and,
    // receive optional payload from AnyAngularComponent.
    const res = await firstValueFrom(dialogPopup.openDialog$()).then((res) => {
      return res.payload;
    });
    return res;
    // return dialogPopup.openDialog$().subscribe(resp => { return resp.payload  });
  }
}
