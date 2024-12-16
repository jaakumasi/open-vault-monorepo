import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  forwardRef,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormControlComponent),
      multi: true,
    },
  ],
})
export class FormControlComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() type: string = 'text';
  @Input() initialValue?: string;
  @Input() iconPath?: string;
  @Input() placeholder?: string;
  @Input() invalidInput?: boolean;

  formControl!: FormControl;
  formBuilder = inject(FormBuilder);

  formControlSubscription?: Subscription;

  ngOnInit(): void {
    this.setupForm();
  }

  ngOnDestroy(): void {
    this.formControlSubscription?.unsubscribe();
  }

  setupForm() {
    this.formControl = this.formBuilder.control(this.initialValue ?? '');
    this.formControlSubscription = this.formControl.valueChanges.subscribe(
      (value) => {
        this.onInputChange(value);
      }
    );
  }

  onInputChange(value: string) {}

  onInputTouched() {}

  registerOnChange(fn: () => void): void {
    this.onInputChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onInputTouched = fn;
  }
  writeValue(obj: any): void {}
}
