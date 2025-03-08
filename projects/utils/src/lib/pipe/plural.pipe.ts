import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralTranslate',
  pure: false,
  standalone: true
})
export class PluralTranslatePipe implements PipeTransform {
  transform(key: string, number: number): string {
    return `${key}.${number == 0 || number == 1 ? 'one' : 'plural'}`;
  }
}
