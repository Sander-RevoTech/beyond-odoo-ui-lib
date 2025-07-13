import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';

import { ColMetaData, Filter, Preset } from '../../models/types';
import { BydGridSessionService } from '../../services/grid-session.services';
import { BydGridViewService } from '../../services/grid-view.service';
import { BydAbstractGridComponent } from '../abstract.component';

@Component({
  selector: 'byd-grid-container',
  imports: [],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
})
export class BydGridContainerComponent extends BydAbstractGridComponent<unknown> implements AfterViewInit, OnDestroy {
  @Input()
  model!: string;

  @Input()
  colsMetaData: ColMetaData<unknown>[] = [];

  @Input()
  preset?: Preset[];

  @ViewChild('table', { static: true }) tableElement!: ElementRef;

  private _session = inject(BydGridSessionService);
  private _service = inject(BydGridViewService);

  ngAfterViewInit() {
    const raw = this._session.getFilter(this.gridId);

    this._grid.init({
      elementRef: this.tableElement,
      colsMetaData: this.colsMetaData,
      initialFilter: raw ?? [],
      preset: this.preset,
      services: {
        getData$: params =>
          this._service.getData$<any>(
            this.model,
            params,
            this.colsMetaData.map(c => c.name)
          ),
      },
    });
  }

  override ngOnDestroy() {
    this._grid.destroy();
  }
}
