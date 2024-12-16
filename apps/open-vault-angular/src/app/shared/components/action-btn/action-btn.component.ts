import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-btn.component.html',
  styleUrl: './action-btn.component.css'
})
export class ActionBtnComponent  {
  @Input() btnText = '';
  @Input() size: 'small' | 'medium' = 'medium';
  @Input() isEnabled = true;
  @Input() isLoading = false;
  @Input() btnType: 'info' | 'warning' = 'info';
  @Output() clickEventEmitter = new EventEmitter<null>();

  onClick() {
    if (this.isEnabled) this.clickEventEmitter.emit();
  }
}
