import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { ToastService } from '../../services/toast/toast.service';
import { ToastVariant } from '../../types';
import { NgClass } from '@angular/common';

export const DEFAULT_TOAST_TIMEOUT = 3000;

/**
 * Toast state is managed by the ToastService which controls when to show or hide the
 * toast with the appropriate message, variant and optional timeout
 */
@Component({
  selector: 'toast',
  standalone: true,
  imports: [NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnDestroy {
  private readonly toastState = inject(ToastService);

  protected show = signal(false);
  protected timeout = signal(DEFAULT_TOAST_TIMEOUT);
  protected text = signal('');
  protected variant = signal<ToastVariant>('success');

  private timeoutRef?: ReturnType<typeof setTimeout>;

  toastEffectRef = effect(
    () => {
      const toastState = this.toastState.getToastState();

      if (toastState.showToast) {
        this.text.set(toastState.toastMessage);
        this.variant.set(toastState.toastVariant);
        this.show.set(true);

        clearTimeout(this.timeoutRef);

        this.timeoutRef = setTimeout(() => {
          this.show.set(false);
          this.toastState.updateToastState({ showToast: false });
        }, toastState.timeout ?? DEFAULT_TOAST_TIMEOUT);
      } else this.show.set(false);
    },
    { allowSignalWrites: true }
  );

  ngOnDestroy(): void {
    this.toastEffectRef.destroy();
  }
}
