import { TabulatorFull as Tabulator } from 'tabulator-tables';

import { ActiveFilter, Filter } from './types';

export class BydGridFilters {
  constructor(
    public readonly scope: string,
    public readonly table: Tabulator
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
    this.table?.setFilter(filters);
  }

  public remove(filter: Filter) {
    this.table.removeFilter(filter.field, filter.type, filter.value);
  }
}
