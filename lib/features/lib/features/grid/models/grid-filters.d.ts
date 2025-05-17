import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { ActiveFilter, Filter } from "./types";
export declare class BydGridFilters {
    readonly scope: string;
    readonly table: Tabulator;
    constructor(scope: string, table: Tabulator);
    get(): ActiveFilter[];
    apply(filters: Filter[]): void;
    remove(filter: Filter): void;
}
