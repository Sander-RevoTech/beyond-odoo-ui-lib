import { Component } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { TranslatePipe } from '@beyond/translation';
import { BydBadgeComponent, BydTextComponent } from '@beyond/ui';
import { Filter } from '../../models/types';


@Component({
  selector: 'byd-grid-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  standalone: true,
  imports: [TranslatePipe, BydBadgeComponent, BydTextComponent]
})
export class BydGridTagsComponent extends BydAbstractGridComponent<unknown> {

  get activeFilters() {
    return this._grid.filters?.get() ?? [];
  }
  override ngOnInit() {
    super.ngOnInit()
  }

  public remove(filter: Filter) {
    this._grid.filters?.remove(filter);
  }
}
