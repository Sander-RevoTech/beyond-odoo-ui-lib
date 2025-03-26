import { Observable } from 'rxjs';
export declare class HandleEntity<T> {
    entity$: Observable<T> | null;
    constructor();
    set(subscriber: Observable<T>): void;
    get$(): Observable<T> | null;
}
