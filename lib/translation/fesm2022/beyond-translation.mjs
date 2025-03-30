import { TranslateService, provideTranslateService, TranslateLoader } from '@ngx-translate/core';
export { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import * as i0 from '@angular/core';
import { Injectable, inject, Optional, Inject, LOCALE_ID, provideAppInitializer } from '@angular/core';
import { Subject, of, forkJoin, map } from 'rxjs';

class BydTranslationRegistryService {
    registered = [];
    newRegistrationSubscription$ = new Subject();
    constructor() { }
    register(register) {
        this.registered.push(register);
        this.newRegistrationSubscription$.next(null);
    }
    getTranslations(lang) {
        return this.registered.map(r => r.getTranslation(lang));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationRegistryService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationRegistryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

const TRANSLATION_CONFIG = 'config_translation';
class BydTranslationService {
    _config;
    translateService = inject(TranslateService);
    _registry = inject(BydTranslationRegistryService);
    constructor(_config = {
        default: 'fr',
        supportedLanguages: ['fr'],
    }) {
        this._config = _config;
        this._registry.newRegistrationSubscription$.subscribe(() => {
            // this._config.supportedLanguages.forEach(l => this.translateService.reloadLang(l));
            this.translateService.reloadLang(this.translateService.currentLang);
        });
    }
    init() {
        // this language will be used as a fallback when a translation isn't found in the current language
        this.translateService.setDefaultLang(this._config.default);
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        let lang = sessionStorage.getItem('lang') ?? this.translateService.getBrowserLang() ?? this._config.default;
        if (!lang || !this._config.supportedLanguages.find(langId => langId === lang)) {
            lang = this._config.default;
        }
        this.translateService.use(lang);
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
    getLanguage() {
        return this.translateService.currentLang;
    }
    get(key, interpolateParams) {
        return this.translateService.get(key, interpolateParams);
    }
    use(lang) {
        return this.translateService.use(lang);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationService, deps: [{ token: TRANSLATION_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydTranslationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [TRANSLATION_CONFIG]
                }] }] });

class BydLazyTranslationService {
    get id() {
        return this._id;
    }
    _registry = inject(BydTranslationRegistryService);
    _id = '';
    _isApp = false;
    constructor(id, isApp = false) {
        this._id = id;
        this._isApp = isApp;
        this._registry.register(this);
    }
    static getInstance() {
        return inject(this);
    }
    getTranslation(lang) {
        return of({});
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

class BydTranslationLoader {
    registry = inject(BydTranslationRegistryService);
    constructor() { }
    getTranslation(lang) {
        return forkJoin([...this.registry.getTranslations(lang)]).pipe(map(translations => translations.reduce((acc, translation) => {
            if (!translation) {
                return acc;
            }
            return this._merge(acc, translation);
        }, {})));
    }
    _merge(current, additionalTranslation) {
        return this._mergeDeep(current, additionalTranslation);
    }
    /**
     * Simple object check.
     * @param item Object
     */
    _isObject(item) {
        return !!(item && typeof item === 'object' && !Array.isArray(item));
    }
    /**
     * Deep merge two objects.
     * @param target Object
     * @param ...sources objects
     */
    _mergeDeep(target, ...sources) {
        if (!sources.length) {
            return target;
        }
        const source = sources.shift();
        if (this._isObject(target) && this._isObject(source)) {
            for (const key in source) {
                if (this._isObject(source[key])) {
                    if (!target[key]) {
                        Object.assign(target, { [key]: {} });
                    }
                    this._mergeDeep(target[key], source[key]);
                }
                else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return this._mergeDeep(target, ...sources);
    }
}

function HttpLoaderFactory() {
    return new BydTranslationLoader();
}
const provideTranslation = (data) => [
    provideTranslateService({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
        },
    }),
    {
        provide: LOCALE_ID,
        deps: [BydTranslationService],
        useFactory: (TranslationService) => TranslationService.getLanguage(),
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

/*
 * Public API Surface of translation
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydLazyTranslationService, BydTranslationRegistryService, BydTranslationService, HttpLoaderFactory, TRANSLATION_CONFIG, provideTranslation };
//# sourceMappingURL=beyond-translation.mjs.map
