import { Provider } from '@angular/core';
import { CamTranslationLoader } from './services/translation.loader';
export declare function HttpLoaderFactory(): CamTranslationLoader;
export declare const provideTranslation: (data: {
    default: string;
    supportedLanguages: string[];
}) => Provider;
