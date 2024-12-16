import { Injectable, signal } from '@angular/core';
import { DEFAULT_TOAST_TIMEOUT } from '../../constants';
import { ToastState } from '../../types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastState = signal<ToastState>({
    showToast: false,
    toastMessage: '',
    toastVariant: 'success',
    timeout: DEFAULT_TOAST_TIMEOUT,
  });

  getToastState() {
    return this.toastState();
  }

  updateToastState(toastState: Partial<ToastState>) {
    this.toastState.update((currState) => ({ ...currState, ...toastState }));
  }
}
