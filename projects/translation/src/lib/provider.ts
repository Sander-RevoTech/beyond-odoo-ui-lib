import { LOCALE_ID, Provider, inject, provideAppInitializer } from '@angular/core';

import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { BydTranslationLoader } from './services/translation.loader';
import { BydTranslationService, TRANSLATION_CONFIG } from './services/translation.service';

export function HttpLoaderFactory() {
  return new BydTranslationLoader();
}

export const provideTranslation = (data: { default: string; supportedLanguages: string[] }): Provider => [
  provideTranslateService({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
    },
  }),
  {
    provide: LOCALE_ID,
    deps: [BydTranslationService],
    useFactory: (TranslationService: BydTranslationService) => TranslationService.getLanguage(),
  },
  provideAppInitializer(() => {
    const translationService = inject(BydTranslationService);
    return translationService.init();
  }),
  {
    provide: TRANSLATION_CONFIG,
    useValue: {
      default: data.default,
      supportedLanguages: data.supportedLanguages,
    },
  },
];
