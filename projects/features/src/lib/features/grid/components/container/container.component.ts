import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ColMetaData } from '../../models/types';
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
  colsMetaData: ColMetaData[] = [];

  @ViewChild('table', { static: true }) tableElement!: ElementRef;

  private _session = inject(BydGridSessionService);
  private _service = inject(BydGridViewService);

  ngAfterViewInit() {
    this._grid.init({
      elementRef: this.tableElement,
      colsMetaData: this.colsMetaData,
      services: {
        getData$: params =>
          this._service.getData$<any>(
            this.model,
            params,
            this.colsMetaData.map(c => c.name)
          ),
      },
    });
    const raw = this._session.getFilter(this.gridId);

    if (raw && raw.length > 0) {
      this._grid.filters?.apply(raw);
      this._session.clearFilter(this.gridId);
    }
  }

  override ngOnDestroy() {
    this._grid.destroy();
  }
}
