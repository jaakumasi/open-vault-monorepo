import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GET_BOOKS_URL, SEARCH_BOOKS_URL, UPLOAD_BOOK_URL } from '../../../shared/constants';
import { Book } from '../../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class BooksApiService {
  http = inject(HttpClient)

  getAllBooks() {
    return this.http.get(GET_BOOKS_URL)
  }

  searchBooks(body: { query: string }) {
    return this.http.post(SEARCH_BOOKS_URL, body)
  }

  uploadBook(book: FormData) {
    return this.http.post(UPLOAD_BOOK_URL, book)
  }
}
