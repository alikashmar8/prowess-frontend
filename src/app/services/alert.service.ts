import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import {
  DialogLayoutDisplay,
  ToastNotificationInitializer
} from '@costlydeveloper/ngx-awesome-popup';
import { Observable, Subject } from 'rxjs';

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
    this.subject.next();
  }

  toastNotification(
    message: string,
    type: DialogLayoutDisplay,
    title?: string
  ) {
    const newToastNotification = new ToastNotificationInitializer();

    newToastNotification.setMessage(message);
    newToastNotification.setConfig({
      LayoutType: type, // SUCCESS | INFO | NONE | DANGER | WARNING
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
}
