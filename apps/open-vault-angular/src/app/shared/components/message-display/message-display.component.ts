import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-display.component.html',
})
export class MessageDisplayComponent {
  @Input() message = '';
  @Input() type!: 'log' | 'error' | 'success'; 
}
