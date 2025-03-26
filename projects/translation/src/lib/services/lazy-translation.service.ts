import { inject } from '@angular/core';

import { Observable, of } from 'rxjs';

import { CamTranslationRegistryService, ITranslation } from './translation-registry.service';

export abstract class CamLazyTranslationService implements ITranslation {
  get id() {
    return this._id;
  }
  private readonly _registry = inject(CamTranslationRegistryService);

  private _id = '';
  private _isApp = false;

  constructor(id: string, isApp = false) {

    this._id = id;
    this._isApp = isApp;
    this._registry.register(this);
  }

  static getInstance() {
    return inject(this);
  }

  public getTranslation(lang: string): Observable<object | null> {
    return of({})
    // return this._strapiService.fetchQueryList$<Translation>(GET_TRANSLATIONS(lang, this._id), 'translations').pipe(
    //   map(translations =>
    //     translations.reduce<{ [index: string]: string }>((acc, translation) => {
    //       acc[(this._isApp ? '' : this._id + '.') + translation.key] = translation.value;
    //       return acc;
    //     }, {})
    //   ),
    //   map(translations =>
    //     Object.entries(translations).reduce((acc, [key, value]) => {
    //       const keys = key.split('.');
    //       keys.reduce<{ [index: string]: any }>((current, k, index) => {
    //         if (index === keys.length - 1) {
    //           current[k] = value;
    //         } else {
    //           current[k] = current[k] || {};
    //         }
    //         return current[k];
    //       }, acc);

    //       return acc;
    //     }, {})
    //   )
    // );
  }
}
