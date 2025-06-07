import { Component, Input, OnInit, inject } from '@angular/core';

import { BydBaseComponent } from '@beyond/utils';
import { Observable, distinctUntilChanged, filter } from 'rxjs';

import { BydGridData } from '../models/grid-data';
import { BydGridInstanceService } from '../services/grid-instance.service';

@Component({ template: '' })
export abstract class BydAbstractGridComponent<T> extends BydBaseComponent implements OnInit {
  @Input()
  gridId!: string;

  get grid() {
    return this._grid;
  }
  get isGroup() {
    return this._grid.isGroup;
  }
  get data() {
    return this._grid.data;
  }
  get dataByGroup() {
    return this._grid.dataByGroup;
  }
  get displayType() {
    return this._grid.displayType;
  }
  public isReady$!: Observable<boolean>;
  public isDataReady$!: Observable<boolean>;

  protected _grid!: BydGridData<T>;
  private _dataService = inject(BydGridInstanceService);

  constructor() {
    super();
  }

  ngOnInit() {
    this._grid = this._dataService.get(this.gridId, true);
    this.isReady$ = this._grid.isReady$.pipe(
      distinctUntilChanged(),
      filter(isReady => isReady)
    );
    this.isDataReady$ = this._grid.isDataReady$.pipe(
      distinctUntilChanged(),
      filter(isReady => isReady)
    );
  }
}
