import { Component } from '@angular/core';

import { TranslatePipe } from '@beyond/translation';
import { BydBadgeComponent, BydButtonComponent, BydTextComponent } from '@beyond/ui';

import { Filter } from '../../models/types';
import { BydAbstractGridComponent } from '../abstract.component';

@Component({
  selector: 'byd-grid-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  standalone: true,
  imports: [TranslatePipe, BydBadgeComponent, BydTextComponent, BydButtonComponent],
})
export class BydGridTagsComponent extends BydAbstractGridComponent<unknown> {
  get group() {
    return this._grid.groupBy;
  }
  get activeFilters() {
    return this._grid.filters?.get() ?? [];
  }
  override ngOnInit() {
    super.ngOnInit();
  }

  public remove(filter: Filter) {
    this._grid.filters?.remove(filter);
  }
  public removeGroup() {
    this._grid.clearGroupBy();
  }
  public clear() {
    this._grid.filters?.apply([]);
    this._grid.clearGroupBy();
  }
}
