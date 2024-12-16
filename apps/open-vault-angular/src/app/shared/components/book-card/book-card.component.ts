import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../types';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book

  onDownload() {
    const a = document.createElement('a');
    a.href = this.book.bookUrl;
    a.target = '_blank';
    a.download = this.book.title;
    a.click();
  }
}
