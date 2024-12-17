import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { take } from 'rxjs';
import { BookCardComponent } from "../../../../shared/components/book-card/book-card.component";
import { SearchComponent } from "../../../../shared/components/search/search.component";
import { Book, ResponseObject } from '../../../../shared/types';
import { BooksApiService } from '../../services/books-api.service';

@Component({
  selector: 'app-books-list',
  standalone: true,
  imports: [CommonModule, SearchComponent, BookCardComponent],
  templateUrl: './books-list.component.html',
})
export class BooksListComponent {
  booksApiService = inject(BooksApiService)

  books = signal<Book[]>([])

  isFetchingBooks = signal(true);

  errorMessage = signal('')

  ngOnInit(): void {
    this.fetchBooks()
  }

  fetchBooks() {
    this.onRequestStart()

    this.booksApiService.getAllBooks()
      .pipe(take(1))
      .subscribe({
        next: (response) => this.handleFetchSuccess(response),
        error: () => this.handleFetchError(),
      })
  }

  onRequestStart() {
    this.isFetchingBooks.set(true)
  }

  onRequestEnd() {
    this.isFetchingBooks.set(false)
  }

  handleFetchSuccess(response: object) {
    this.onRequestEnd()

    const books = (response as ResponseObject).data as Book[]
    this.books.set(books);
  }

  handleFetchError() {
    this.onRequestEnd();

    this.errorMessage.set('Could not fetch books')
  }

  onSearchBook(query: string) {
    this.onRequestStart();

    this.booksApiService.searchBooks({ query })
      .pipe(take(1))
      .subscribe({
        next: (response) => this.handleFetchSuccess(response),
        error: () => this.handleFetchError()
      })
  }
}
