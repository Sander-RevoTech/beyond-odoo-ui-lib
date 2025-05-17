import { Component, inject, signal } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { InputBase } from '@beyond/form-model';
import { BydGridFormService } from '../../services/grid-form.services';
import { BydFormComponent } from '@beyond/form-basic';

@Component({
  selector: 'byd-grid-form',
  imports: [BydFormComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class BydGridFormComponent extends BydAbstractGridComponent<unknown> {

  public filtersForm = signal<InputBase<any>[]>([]);

  private _formService = inject(BydGridFormService<unknown>)

  public override ngOnInit() {
    super.ngOnInit();

    this._registerSubscription(this.isReady$.subscribe({
      next: () => this.filtersForm.set(this._formService.getFiltersForm(this._grid))
    }));
  }

  public apply(data: any) {
    const filters = this._formService.formatFiltersForm(this._grid, data);

    this._grid.filters?.apply(filters);
  }
}
