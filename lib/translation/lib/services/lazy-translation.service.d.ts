import { Observable } from 'rxjs';
import { ITranslation } from './translation-registry.service';
export declare abstract class BydLazyTranslationService implements ITranslation {
    get id(): string;
    private readonly _registry;
    private _id;
    private _isApp;
    constructor(id: string, isApp?: boolean);
    static getInstance(): BydLazyTranslationService;
    getTranslation(lang: string): Observable<object | null>;
}
