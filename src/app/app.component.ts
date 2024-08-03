import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { DateTime } from 'luxon';
import { Observable, timer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CIP-FRONT';
  refreshTokenTimer: Observable<number> = timer(0, 3000);

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    if (this.authService.isAuthenticated) {
      this.translate.use(this.authService.getSavedLanguage() || 'en');
    }
    this.startRefreshTokenTimer();
  }

  startRefreshTokenTimer() {
    this.refreshTokenTimer.subscribe(() => {
      if (this.authService.getToken() !== null) {
        let difference = this.calculateTimeDifference();
        this.setLogoutTimer(difference);
      }
    });
  }

  setLogoutTimer(timeDifference: number) {
    if (timeDifference > 0) {
      setTimeout(() => {
        this.authService.logout();
      }, timeDifference);
    } else {
      this.authService.logout();
    }
  }

  calculateTimeDifference() {
    let token = this.authService.getToken();
    if (token) {
      let decodedToken = jwtDecode(token);
      let expTimeMillis = DateTime.fromSeconds(decodedToken.exp).toMillis();
      let timeMillis = DateTime.now().toMillis();
      let difference = expTimeMillis - timeMillis;
      return difference;
    }
    return 0;
  }
}
