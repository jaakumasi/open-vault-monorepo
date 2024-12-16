import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STORAGE_KEYS } from '../../constants';
import { ActionBtnComponent } from '../action-btn/action-btn.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ActionBtnComponent],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  showSigninButton = signal(false)

  ngOnInit(): void {
    const token = globalThis.window?.localStorage.getItem(STORAGE_KEYS.TOKEN)
    token ?
      this.showSigninButton.set(false) :
      this.showSigninButton.set(true)
  }
}
