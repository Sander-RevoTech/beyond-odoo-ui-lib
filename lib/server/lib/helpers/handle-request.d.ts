import { BehaviorSubject, Observable } from 'rxjs';
export declare class HandleComplexRequest<T> {
    data$: BehaviorSubject<{
        [index: string]: T;
        [index: number]: T;
    }>;
    constructor();
    fetch(id: string | number, subscriber: Observable<T>): Observable<T>;
    update(id: string | number, item: T, merge?: boolean): void;
    get(key: string | number): NonNullable<T> | null;
    get$(key: string | number): Observable<T>;
}
export declare class HandleSimpleRequest<T> {
    data$: BehaviorSubject<T | null>;
    constructor();
    fetch(subscriber: Observable<T | undefined | null>): Observable<T & {}>;
    get(): NonNullable<T> | null;
    get$(): Observable<T | null>;
}
