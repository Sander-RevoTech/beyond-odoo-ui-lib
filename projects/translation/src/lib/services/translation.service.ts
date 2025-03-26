import { Inject, Injectable, Optional, inject } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { SessionStorage } from 'storage-manager-js';

import { CamTranslationRegistryService } from './translation-registry.service';

export const TRANSLATION_CONFIG = 'config_translation';
export interface ITranslationConfig {
  default: string;
  supportedLanguages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CamTranslationService {
  public translateService = inject(TranslateService);
  private _registry = inject(CamTranslationRegistryService);

  constructor(
    @Optional()
    @Inject(TRANSLATION_CONFIG)
    private _config: ITranslationConfig = {
      default: 'fr',
      supportedLanguages: ['fr'],
    }
  ) {
    this._registry.newRegistrationSubscription$.subscribe(() => {
      // this._config.supportedLanguages.forEach(l => this.translateService.reloadLang(l));
      this.translateService.reloadLang(this.translateService.currentLang);
    });
  }

  public init(): void {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translateService.setDefaultLang(this._config.default);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    let lang: string = SessionStorage.get('lang') ?? this.translateService.getBrowserLang() ?? this._config.default;

    if (!lang || !this._config.supportedLanguages.find(langId => langId === lang)) {
      lang = this._config.default;
    }
    this.translateService.use(lang);

    this.translateService.onLangChange.subscribe(({ lang }) => {
      if (!SessionStorage.has('lang')) {
        SessionStorage.set('lang', lang);
        return;
      }

      if (lang === SessionStorage.get('lang')) {
        return;
      }

      SessionStorage.set('lang', lang);
      location.reload();
    });
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
