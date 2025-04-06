import { inject, Injectable } from '@angular/core';

import { filter, Subject } from 'rxjs';

import { SearchItem, SearchResult } from './dto/search';
import { BydBaseOdooService } from '../../../services/baseService';

@Injectable({
  providedIn: 'root',
})
export class BydScanPackingService extends BydBaseOdooService {

  public askScanning = new Subject();

  public searchScanItem: SearchItem | null = null;

  constructor() {
    super();
  }

  public lookForPacking(id: number) {
    return this._odooService
        .action$<SearchResult>('sale.order', 'search_by_sale_order_id', [id])
        .pipe(filter(data => !!data));

  }

  public setActiveScanItem(item: SearchItem) {
    this.searchScanItem = item;
  }
  public clearActiveScanItem() {
    this.searchScanItem = null;
  }
}
