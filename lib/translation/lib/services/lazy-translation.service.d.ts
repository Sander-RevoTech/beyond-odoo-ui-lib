import { Observable } from 'rxjs';
import { ITranslation } from './translation-registry.service';
export declare abstract class BydLazyTranslationService implements ITranslation {
    get id(): string;
    private readonly _registry;
    private _id;
    private _isApp;
    private _translations;
    constructor(id: string, isApp?: boolean, translation?: {
        [key: string]: Object;
    });
    static getInstance(): BydLazyTranslationService;
    getTranslation(lang: string): Observable<object | null>;
}
