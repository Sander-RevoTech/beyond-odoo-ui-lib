import { Component, Input, inject } from '@angular/core';

import { TextBoxComponent } from '@beyond/form-input';
import { InputTextBox } from '@beyond/form-model';

import { Filter } from '../../models/types';
import { BydGridSessionService } from '../../services/grid-session.services';
import { BydAbstractGridComponent } from '../abstract.component';

@Component({
  selector: 'byd-grid-search',
  imports: [TextBoxComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class BydGridSearchComponent extends BydAbstractGridComponent<any> {
  @Input()
  outOfBox = false;

  public input = new InputTextBox();

  private _session = inject(BydGridSessionService);

  constructor() {
    super();
    this.input.createFormControl();
  }
  public valueChanged(value: string) {
    const filter: Filter[] = [
      {
        field: 'name',
        type: 'like',
        value,
      },
    ];
    if (this.outOfBox) {
      this._session.setFilter(this.gridId, filter);
    } else {
      this.grid.filters?.apply(filter);
    }
  }
}
