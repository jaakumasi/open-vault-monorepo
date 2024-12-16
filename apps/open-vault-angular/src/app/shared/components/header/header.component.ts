import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CLIENT_ENDPOINTS, STORAGE_KEYS } from '../../constants';
import { ActionBtnComponent } from '../action-btn/action-btn.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

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
  showManageBooksButton = signal(false)

  ngOnInit(): void {
    const token = globalThis.window?.localStorage.getItem(STORAGE_KEYS.TOKEN)
    token ?
      this.showSigninButton.set(false) :
      this.showSigninButton.set(true)

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = event.urlAfterRedirects;

        console.log(url)
        if (url.includes(CLIENT_ENDPOINTS.MANAGE_BOOKS))
          this.showManageBooksButton.set(false);
        else
          this.showManageBooksButton.set(true);
      });
  }

  async onManageBooks() {
    await this.router.navigateByUrl(`/${CLIENT_ENDPOINTS.MANAGE_BOOKS}`)
  }

  handleAuth() {

  }
}
