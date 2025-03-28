import { TranslateService } from '@ngx-translate/core';
import * as i0 from "@angular/core";
export declare const TRANSLATION_CONFIG = "config_translation";
export interface ITranslationConfig {
    default: string;
    supportedLanguages: string[];
}
export declare class CamTranslationService {
    private _config;
    translateService: TranslateService;
    private _registry;
    constructor(_config?: ITranslationConfig);
    init(): void;
    getLanguage(): string;
    get(key: string | string[], interpolateParams?: Object): import("rxjs").Observable<any>;
    use(lang: string): import("rxjs").Observable<import("@ngx-translate/core").InterpolatableTranslationObject>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CamTranslationService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CamTranslationService>;
}
