import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
export declare class CamTranslationLoader implements TranslateLoader {
    private registry;
    constructor();
    getTranslation(lang: string): Observable<object>;
    private _merge;
    /**
     * Simple object check.
     * @param item Object
     */
    private _isObject;
    /**
     * Deep merge two objects.
     * @param target Object
     * @param ...sources objects
     */
    private _mergeDeep;
}
