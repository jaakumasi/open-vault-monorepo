import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invalid-input-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invalid-input-message.component.html',
})
export class InvalidInputMessageComponent {
  @Input() message = '';
}
