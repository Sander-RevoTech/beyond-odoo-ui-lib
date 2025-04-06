import { Component, inject, Input, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BydBaseComponent } from '@beyond/utils';
import { BydScanPackingService } from '../../../services/scan/scan-packing.service';
import { BydNotificationService } from '@beyond/notification';
import { SearchItem, SearchResult } from '../../../services/scan/dto/search';
import { CardComponent, CardHeaderComponent, CardTitleComponent, EmptyComponent, ErrorComponent, LoaderComponent } from '@beyond/ui';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TranslatePipe } from '@beyond/translation';
import { MatIcon } from '@angular/material/icon';


export interface Scope {
  key: string;
  navigation: (id: number) => void;
}
@Component({
  selector: '',
  templateUrl: './scan-packing-modal.component.html',
  styleUrls: ['./scan-packing-modal.component.scss'],
  standalone: true,
  imports: [LoaderComponent, EmptyComponent, ErrorComponent, ZXingScannerModule, CardComponent, CardHeaderComponent, CardTitleComponent, TranslatePipe, MatIcon],
})
export class ScanPackingDialog extends BydBaseComponent implements OnDestroy {
  @Input()
  scopes!: Scope[];

  private readonly _scanPackingService = inject(BydScanPackingService);
  private readonly _notificationService = inject(BydNotificationService);

  public step: 'scan' | 'search' = 'scan';

  public activeScope: Scope | null = null;

  public searchResult: SearchResult | null = null;

  get noData() {
    return (
      !this.searchResult ||
      (this.searchResult.deliveries.length === 0 &&
        this.searchResult.returns.length === 0 &&
        this.searchResult.work_orders.length === 0)
    );
  }
  constructor(public dialogRef: MatDialogRef<ScanPackingDialog>) {
    super();
  }

  public scanSuccess(result: string) {
    if (!result) {
      this._notificationService.addErrorNotification('QR core is not valid');
      this.dialogRef.close();
      return;
    }

    const id = this._extractIdFormUrl(result);

    if (!id || isNaN(id)) {
      this._notificationService.addErrorNotification('QR core is not valid (id)');
      this.dialogRef.close();
      return;
    }

    const model = this._extractModelFormUrl(result);
    if (model?.toLocaleLowerCase() !== 'sale.order') {
      this._notificationService.addErrorNotification('QR core is not valid (model)');
      this.dialogRef.close();
      return;
    }

    this.step = 'search';
    this._scanPackingService.lookForPacking(id).subscribe({
      next: searchResult => {
        this._processSearchResult(searchResult);

        this.requestState.completed();
      },
      error: () => {
        this.dialogRef.close();
      },
    });
  }
  public permissionResponse(repsonse: boolean) {
    if (!repsonse) {
      this._notificationService.addErrorNotification('Permission not granted');
      this.dialogRef.close();
      return;
    }
  }
  public getDataByScope(scope: Scope) {
    switch (scope.key) {
      case 'workcenter':
        return this.searchResult?.work_orders || [];
      case 'delivery':
        return this.searchResult?.deliveries || [];
      case 'return':
        return this.searchResult?.returns || [];
      default:
        return [];
    }
  }
  public setScope(scope: Scope) {
    this.activeScope = scope;

    const list = this.getDataByScope(scope);
    if (list.length === 1) {
      this.navigateTo(scope, list[0]);
    }
  }

  public navigateTo(scope: Scope | null, item: SearchItem) {
    if(!scope) {
      return;
    }
    this._scanPackingService.setActiveScanItem(item);

    scope.navigation(item.type);
  }

  private _processSearchResult(searchResult: SearchResult) {
    this.searchResult = searchResult;

    if (searchResult.deliveries.length + searchResult.returns.length + searchResult.work_orders.length !== 1) {
      return;
    }
    if (searchResult.deliveries.length > 0) {
      this.navigateTo(this._getScopeByKey('delivery'), searchResult.deliveries[0]);
      return;
    }
    if (searchResult.returns.length > 0) {
      this.navigateTo(this._getScopeByKey('return'), searchResult.returns[0]);
      return;
    }
    if (searchResult.work_orders.length > 0) {
      this.navigateTo(this._getScopeByKey('workcenter'), searchResult.work_orders[0]);
      return;
    }
  }
  private _getScopeByKey(key: string): Scope | null {
    return this.scopes.find(scope => scope.key === key) || null;
  }

  private _extractIdFormUrl(url: string): number | null {
    const match = url.match(/id=(\d+)/);

    if (!match) {
      return null;
    }

    return Number(match[1]);
  }
  private _extractModelFormUrl(url: string): string | null {
    const match = url.match(/model=([a-zA-Z.]+)/);

    if (!match) {
      return null;
    }

    return match[1];
  }
}
