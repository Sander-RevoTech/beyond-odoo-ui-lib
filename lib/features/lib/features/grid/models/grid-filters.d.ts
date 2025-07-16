import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { ActiveFilter, Filter, Preset } from './types';
export declare class BydGridFilters {
    readonly scope: string;
    readonly table: Tabulator;
    readonly preset: Preset[];
    private _debounceTimer;
    constructor(scope: string, table: Tabulator, preset?: Preset[]);
    get(): ActiveFilter[];
    apply(filters: Filter[]): void;
    remove(filter: Filter): void;
}
