import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function slugValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    // Vérifier si la valeur respecte les caractéristiques d'un slug
    const isValidSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);

    return isValidSlug ? null : { invalidSlug: true };
  };
}
