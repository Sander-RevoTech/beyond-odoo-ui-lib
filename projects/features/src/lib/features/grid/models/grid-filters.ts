import { TabulatorFull as Tabulator } from 'tabulator-tables';

import { ActiveFilter, Filter, Preset } from './types';

export class BydGridFilters {
  private _debounceTimer: any = null;

  constructor(
    public readonly scope: string,
    public readonly table: Tabulator,
    public readonly preset: Preset[] = []
  ) {}

  public get() {
    return this.table.getFilters(false).reduce<ActiveFilter[]>((acc, filter) => {
      const existing = acc.find(tag => tag.key === filter.field);
      if (existing) {
        existing.values.push(filter);
      } else {
        acc.push({
          key: filter.field,
          values: [filter],
        });
      }
      return acc;
    }, []);
  }
  public apply(filters: Filter[]) {
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    this._debounceTimer = setTimeout(() => {
      this.table.setFilter(filters);
    }, 500);
  }

  public remove(filter: Filter) {
    this.table.removeFilter(filter.field, filter.type, filter.value);
  }
}
