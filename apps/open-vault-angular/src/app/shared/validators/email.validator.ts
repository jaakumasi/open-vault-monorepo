import { AbstractControl, ValidationErrors } from '@angular/forms';

export const emailValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (control.value && !emailRegex.test(control.value)) return { email: true };
  else return null;
};
