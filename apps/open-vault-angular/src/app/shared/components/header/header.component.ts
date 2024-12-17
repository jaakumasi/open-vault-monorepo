import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { CLIENT_ENDPOINTS, STORAGE_KEYS } from '../../constants';
import { ActionBtnComponent } from '../action-btn/action-btn.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ActionBtnComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  router = inject(Router)

  showSigninButton = signal(false)
  isBooksManagementPageActive = signal(false)
  url = signal(this.router.url)

  ngOnInit(): void {
    const token = globalThis.window?.localStorage.getItem(STORAGE_KEYS.TOKEN)
    token ?
      this.showSigninButton.set(false) :
      this.showSigninButton.set(true)

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.url.set(event.urlAfterRedirects)

        console.log(this.url())

        if (this.url().includes(CLIENT_ENDPOINTS.MANAGE_BOOKS))
          this.isBooksManagementPageActive.set(false);
        else
          this.isBooksManagementPageActive.set(true);
      });
  }

  async onNavigateToBooksPage() {
    await this.router.navigateByUrl(`/${this.isBooksManagementPageActive() ? CLIENT_ENDPOINTS.HOME : CLIENT_ENDPOINTS.MANAGE_BOOKS}`)
  }

  handleAuth() {

  }
}
