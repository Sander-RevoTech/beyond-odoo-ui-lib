import { Provider } from '@angular/core';
import { BydTranslationLoader } from './services/translation.loader';
export declare function HttpLoaderFactory(): BydTranslationLoader;
export declare const provideTranslation: (data: {
    default: string;
    supportedLanguages: string[];
}) => Provider;
