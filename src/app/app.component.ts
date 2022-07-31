import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { getLang, isMobile } from 'src/utils/functions';
import { AuthService } from './services/auth-service.service';
import { LoadingService } from './services/loading.service';
import { TranslateService } from '@ngx-translate/core';

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
    private cdRef: ChangeDetectorRef,
    private router: Router,
    public translate: TranslateService
  ) {
    this.isAuthenticated = this.authService.isAuthenticated();
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd && isMobile()) {
        this.showMenu = false;
      }
    });
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    let storedLanguage = getLang();
    if (storedLanguage) {
      translate.use(storedLanguage);
    }
  }

  ngOnInit(): void {
    if (isMobile()) {
      this.showMenu = false;
    }

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

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
