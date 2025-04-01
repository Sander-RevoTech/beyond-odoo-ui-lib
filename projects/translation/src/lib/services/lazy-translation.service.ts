import { inject } from '@angular/core';

import { map, Observable, of } from 'rxjs';

import { BydTranslationRegistryService, ITranslation } from './translation-registry.service';

export abstract class BydLazyTranslationService implements ITranslation {
  get id() {
    return this._id;
  }
  private readonly _registry = inject(BydTranslationRegistryService);

  private _id = '';
  private _isApp = false;
  private _translations: { [key: string]: any } = {};

  constructor(id: string, isApp = false, translation: { [key: string]: Object } = {}) {
    this._id = id;
    this._isApp = isApp;
    this._translations = translation;
    this._registry.register(this);
  }

  static getInstance() {
    return inject(this);
  }

  public getTranslation(lang: string): Observable<object | null> {
    return of(this._translations[lang]).pipe(
      map(translations =>
        Object.entries(translations).reduce((acc, [key, value]) => {
          const keys = key.split('.');
          keys.reduce<{ [index: string]: any }>((current, k, index) => {
            if (index === keys.length - 1) {
              current[k] = value;
            } else {
              current[k] = current[k] || {};
            }
            return current[k];
          }, acc);

          return acc;
        }, {})
      )
    );
  }
}
