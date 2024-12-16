import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { SCREEN_SIZE } from './shared/types';
import { BREAKPOINTS } from './shared/constants';
import { BreakpointState } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { BreakpointObserverService } from './shared/services/breakpoint-observer.service';
import { updateScreenSize } from './shared/store/actions.store';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  store = inject(Store);
  breakpointService = inject(BreakpointObserverService);

  screenSize!: SCREEN_SIZE;

  isXSmallScreen = false;
  isSmallScreen = false;
  isMediumScreen = false;
  isLargeScreen = false;
  isXLargeScreen = false;

  ngOnInit(): void {
    // this.initScreenWidth();
    // this.subToMediaObserver();
  }

  initScreenWidth() {
    this.store.dispatch(
      updateScreenSize({ screen: this.breakpointService.intialScreenWidth() })
    );
  }

  subToMediaObserver() {
    this.breakpointService.observeMedia().subscribe((observer) => {
      if (!observer.matches) return;
      this.screenSize = this.getCurrentScreenWidth(observer);
      this.store.dispatch(updateScreenSize({ screen: this.screenSize }));
    });
  }

  getCurrentScreenWidth(observer: BreakpointState): SCREEN_SIZE {
    let screenSize: SCREEN_SIZE;
    this.isXSmallScreen = observer.breakpoints[BREAKPOINTS.XSMALL];
    this.isSmallScreen = observer.breakpoints[BREAKPOINTS.SMALL];
    this.isMediumScreen = observer.breakpoints[BREAKPOINTS.MEDIUM];
    this.isLargeScreen = observer.breakpoints[BREAKPOINTS.LARGE];
    this.isXLargeScreen = observer.breakpoints[BREAKPOINTS.LARGE];
    screenSize = observer.breakpoints[BREAKPOINTS.XSMALL]
      ? SCREEN_SIZE.xsmall
      : observer.breakpoints[BREAKPOINTS.SMALL]
        ? SCREEN_SIZE.small
        : observer.breakpoints[BREAKPOINTS.MEDIUM]
          ? SCREEN_SIZE.medium
          : observer.breakpoints[BREAKPOINTS.LARGE]
            ? SCREEN_SIZE.large
            : SCREEN_SIZE.xlarge;

    return screenSize;
  }
}
