import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionBtnComponent } from "../../../../shared/components/action-btn/action-btn.component";
import { FormControlComponent } from "../../../../shared/components/form-control/form-control.component";
import { SpaceComponent } from "../../../../shared/components/space/space.component";
import { BooksApiService } from '../../services/books-api.service';
import { take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-books',
  standalone: true,
  imports: [CommonModule, FormsModule, FormControlComponent, SpaceComponent, ActionBtnComponent],
  templateUrl: './manage-books.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageBooksComponent {
  booksApiService = inject(BooksApiService)

  isUploadingBook = signal(false);
  uploadFeedbackMessage = signal('');

  formData = {
    title: '',
    author: '',
    description: ''
  };

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.selectedFile)
      return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.formData.title);
    formData.append('author', this.formData.author);
    formData.append('description', this.formData.description);

    this.onRequestStart()

    this.booksApiService.uploadBook(formData)
      .pipe(take(1))
      .subscribe({
        next: (response) => this.handleUploadSuccess(response),
        error: () => this.handleUploadError()
    })

    // Reset form data after submission
    this.formData = {
      title: '',
      author: '',
      description: ''
    };
    this.selectedFile = null;
  }

  onRequestStart() {
    this.isUploadingBook.set(true);
    this.uploadFeedbackMessage.set('');
  }

  onRequestEnd() {
    this.isUploadingBook.set(false);
  }


  handleUploadSuccess(response: any) {
    this.onRequestEnd()
    
    console.log(response)
  }

  handleUploadError() {
    this.onRequestEnd();

    this.uploadFeedbackMessage.set('Upload failed.')
  }
}


