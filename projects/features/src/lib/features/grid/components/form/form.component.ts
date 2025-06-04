import { Component, inject, signal } from '@angular/core';

import { BydFormComponent } from '@beyond/form-basic';
import { InputBase } from '@beyond/form-model';
import { BydTitleComponent } from '@beyond/ui';

import { BydGridFormService } from '../../services/grid-form.services';
import { BydAbstractGridComponent } from '../abstract.component';

@Component({
  selector: 'byd-grid-form',
  imports: [BydFormComponent, BydTitleComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class BydGridFormComponent extends BydAbstractGridComponent<unknown> {
  public filtersForm = signal<InputBase<any>[]>([]);
  public groupForm = signal<InputBase<any>[]>([]);

  private _formService = inject(BydGridFormService<unknown>);

  public override ngOnInit() {
    super.ngOnInit();

    this._registerSubscription(
      this.isReady$.subscribe({
        next: () => {
          this.filtersForm.set(this._formService.getFiltersForm(this._grid));
          this.groupForm.set(this._formService.getGroupForm(this._grid));
        },
      })
    );
  }

  public applyFilters(data: any) {
    const filters = this._formService.formatFiltersForm(this._grid, data);

    this._grid.filters?.apply(filters);
  }
  public applyGroup(data: any) {
    const group = this._formService.formatGroupForm(data);

    if (!group) {
      this._grid.clearGroupBy();
      return;
    }
    this._grid.setGroupBy(group);
  }
}
