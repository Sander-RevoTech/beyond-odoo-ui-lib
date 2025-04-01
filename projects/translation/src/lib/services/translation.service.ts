import { Inject, Injectable, Optional, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { BydTranslationRegistryService } from './translation-registry.service';
import { debounceTime, mergeMap } from 'rxjs';

export const TRANSLATION_CONFIG = 'config_translation';
export interface ITranslationConfig {
  default: string;
  supportedLanguages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class BydTranslationService {
  public translateService = inject(TranslateService);
  private _registry = inject(BydTranslationRegistryService);

  constructor(
    @Optional()
    @Inject(TRANSLATION_CONFIG)
    private _config: ITranslationConfig = {
      default: 'fr',
      supportedLanguages: ['fr'],
    }
  ) {
    this._registry.newRegistrationSubscription$.pipe(
      debounceTime(500),
      mergeMap(() => this.translateService.reloadLang(this.translateService.currentLang))
    ).subscribe({
      next: (data) => this.translateService.onTranslationChange.emit({ translations: data, lang: this.translateService.currentLang})
    });

    this.translateService.onLangChange.subscribe(({ lang }) => {
      if (!sessionStorage.getItem('lang')) {
        sessionStorage.setItem('lang', lang);
        return;
      }

      if (lang === sessionStorage.getItem('lang')) {
        return;
      }

      sessionStorage.setItem('lang', lang);
      location.reload();
    });
  }

  public init(): void {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang(this._config.default);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang: string = sessionStorage.getItem('lang') ?? this.translateService.getBrowserLang() ?? this._config.default;

    if (!lang || !this._config.supportedLanguages.find(langId => langId === lang)) {
      lang = this._config.default;
    }
    this.translateService.use(lang);


  }

  public getLanguage(): string {
    return this.translateService.currentLang;
  }

  public get(key: string | string[], interpolateParams?: Object) {
    return this.translateService.get(key, interpolateParams);
  }

  public use(lang: string) {
    return this.translateService.use(lang);
  }
}
