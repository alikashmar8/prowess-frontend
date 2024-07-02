import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SCREEN_TIMEOUT_IN_SECONDS } from 'src/constants/constants';
import { getLang, isMobile, setLang } from 'src/utils/functions';
import IdleTimer from './idleTimer';
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
  timer: any;

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
    this.timer = new IdleTimer({
      timeout: SCREEN_TIMEOUT_IN_SECONDS, //expired after 10 secs
      onTimeout: () => {
        if (this.authService.isAuthenticated()) {
          this.authService.logout();
          window.location.reload();
        }
      },
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
    this.timer.clear();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  switchLang(language: string) {
    this.translate.use(language);
    setLang(language);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }
}
