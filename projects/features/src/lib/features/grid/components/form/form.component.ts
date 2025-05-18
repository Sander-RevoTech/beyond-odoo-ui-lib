import { Component, EventEmitter, Output, inject, signal } from '@angular/core';

import { BydFormComponent } from '@beyond/form-basic';
import { InputBase } from '@beyond/form-model';

import { Filter } from '../../models/types';
import { BydGridFormService } from '../../services/grid-form.services';
import { BydAbstractGridComponent } from '../abstract.component';

@Component({
  selector: 'byd-grid-form',
  imports: [BydFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class BydGridFormComponent extends BydAbstractGridComponent<unknown> {
  @Output()
  applied = new EventEmitter<Filter[]>();

  public filtersForm = signal<InputBase<any>[]>([]);

  private _formService = inject(BydGridFormService<unknown>);

  public override ngOnInit() {
    super.ngOnInit();

    this._registerSubscription(
      this.isReady$.subscribe({
        next: () => this.filtersForm.set(this._formService.getFiltersForm(this._grid)),
      })
    );
  }

  public apply(data: any) {
    const filters = this._formService.formatFiltersForm(this._grid, data);

    this._grid.filters?.apply(filters);

    this.applied.emit(filters);
  }
}
