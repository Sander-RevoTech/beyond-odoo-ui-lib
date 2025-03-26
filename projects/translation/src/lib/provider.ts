import { inject, LOCALE_ID, provideAppInitializer, Provider } from '@angular/core';

import { TranslateLoader, provideTranslateService } from '@ngx-translate/core';

import { CamTranslationLoader } from './services/translation.loader';
import { CamTranslationService, TRANSLATION_CONFIG } from './services/translation.service';

export function HttpLoaderFactory() {
  return new CamTranslationLoader();
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
    deps: [CamTranslationService],
    useFactory: (TranslationService: CamTranslationService) => TranslationService.getLanguage(),
  },
  provideAppInitializer(() => {
    const translationService = inject(CamTranslationService);
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
