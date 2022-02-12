import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth-service.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean = true;
  isAuthenticated = false;
  loadingSub: Subscription;
  showMenu: boolean = true;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private cdRef: ChangeDetectorRef
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.loadingSub = this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    setTimeout(() => {
      this.isLoading = this.loadingService.appLoading(false);
    }, 0);
  }
  ngOnDestroy() {
    //unsub to avoid leaks
    this.loadingSub.unsubscribe();
  }

  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
}
