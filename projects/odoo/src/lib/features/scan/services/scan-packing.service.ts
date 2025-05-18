import { Injectable, inject } from '@angular/core';

import { Subject, filter } from 'rxjs';

import { BydBaseOdooService } from '../../../services/baseService';
import { SearchItem, SearchResult } from './dto/search';

@Injectable({
  providedIn: 'root',
})
export class BydScanPackingService extends BydBaseOdooService {
  public askScanning = new Subject();

  public searchScanItem: SearchItem | null = null;

  constructor() {
    super();
  }

  public lookForPacking$(model: string, id: number) {
    return this._odooService.action$<SearchResult>(model, 'search_by_id', id).pipe(filter(data => !!data));
  }

  public setActiveScanItem(item: SearchItem) {
    this.searchScanItem = item;
  }
  public clearActiveScanItem() {
    this.searchScanItem = null;
  }
}
