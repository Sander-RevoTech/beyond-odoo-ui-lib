import { Injectable } from '@angular/core';

import { BydLazyTranslationService } from '@beyond/translation';

import * as en from './en.json';

@Injectable({
  providedIn: 'root',
})
export class AppTranslationService extends BydLazyTranslationService {
  constructor() {
    super('reuz', true, { en });
  }
}
