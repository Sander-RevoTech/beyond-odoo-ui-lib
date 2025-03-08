import { formatDate } from '@angular/common';
import { Pipe, PipeTransform, inject } from '@angular/core';

// import { differenceInCalendarDays } from 'date-fns';

// import { TaTranslationService } from '@beyond/translation';

@Pipe({ name: 'appTimeAgo' })
export class TimeAgoDirective implements PipeTransform {
  // protected _translationService = inject(TaTranslationService);

  transform(date: string) {
    // const diffDays = differenceInCalendarDays(new Date(date), new Date());

    // const key = this._getTranslationKey(diffDays);

    return date
    // return this._translationService.get(key, {
    //   date: formatDate(date, 'mediumDate', this._translationService.getLanguage()),
    //   days: Math.abs(diffDays),
    // });
  }

  private _getTranslationKey(diffDays: number): string {
    if (diffDays === 0) {
      return 'common.today';
    }
    if (diffDays === -1) {
      return 'common.yesterday';
    }
    if (diffDays === 1) {
      return 'common.tomorrow';
    }
    if (diffDays < -1 && diffDays >= -3) {
      return 'common.above';
    }
    if (diffDays > 1 && diffDays <= 3) {
      return 'common.ahead';
    }
    return 'common.to-date';
  }
}
