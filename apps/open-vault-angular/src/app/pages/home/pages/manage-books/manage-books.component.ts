import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TOAST_MESSAGES } from 'apps/open-vault-angular/src/app/shared/constants';
import { ToastService } from 'apps/open-vault-angular/src/app/shared/services/toast/toast.service';
import { take } from 'rxjs';
import { ActionBtnComponent } from "../../../../shared/components/action-btn/action-btn.component";
import { FormControlComponent } from "../../../../shared/components/form-control/form-control.component";
import { SpaceComponent } from "../../../../shared/components/space/space.component";
import { BooksApiService } from '../../services/books-api.service';
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
  toastService = inject(ToastService)

  isUploadingBook = signal(false);

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
        next: () => this.handleUploadSuccess(),
        error: (error) => this.handleUploadError(error)
      })
  }

  onRequestStart() {
    this.isUploadingBook.set(true);
  }

  onRequestEnd() {
    this.isUploadingBook.set(false);
  }


  handleUploadSuccess() {
    this.onRequestEnd()

    this.resetUploadForm();

    this.toastService.updateToastState({
      showToast: true,
      toastMessage: TOAST_MESSAGES.UPLOAD_SUCESSS,
      toastVariant: 'success'
    })
  }

  handleUploadError(error: HttpErrorResponse) {
    this.onRequestEnd();

    this.toastService.updateToastState({
      showToast: true,
      toastMessage: error.error.message ?? TOAST_MESSAGES.UPLOAD_FAILURE,
      toastVariant: 'error'
    })
  }

  resetUploadForm() {
    this.formData = {
      title: '',
      author: '',
      description: ''
    };

    this.selectedFile = null;
  }
}


