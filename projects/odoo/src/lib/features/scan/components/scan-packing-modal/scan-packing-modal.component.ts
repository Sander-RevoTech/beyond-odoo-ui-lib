import { Component, Inject, Input, OnDestroy, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { BydNotificationService } from '@beyond/notification';
import { TranslatePipe } from '@beyond/translation';
import {
  CardComponent,
  CardCtaComponent,
  CardHeaderComponent,
  CardTitleComponent,
  EmptyComponent,
  ErrorComponent,
  LoaderComponent,
} from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { SearchItem, SearchResult } from '../../services/dto/search';
import { BydScanPackingService } from '../../services/scan-packing.service';
import { BydScanningComponent } from '../scanning/scanning.component';

export interface Scope {
  key: string;
  navigation: (id: SearchItem) => void;
}

export interface ScanPackingDialogData {
  scopes: Scope[];
}
@Component({
  selector: '',
  templateUrl: './scan-packing-modal.component.html',
  styleUrls: ['./scan-packing-modal.component.scss'],
  standalone: true,
  imports: [
    LoaderComponent,
    EmptyComponent,
    ErrorComponent,
    ZXingScannerModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    TranslatePipe,
    MatIcon,
    CardCtaComponent,
    BydScanningComponent,
  ],
})
export class ScanPackingDialog extends BydBaseComponent implements OnDestroy {
  private readonly _scanPackingService = inject(BydScanPackingService);
  private readonly _notificationService = inject(BydNotificationService);

  public step = signal<'scan' | 'search'>('scan');

  public activeScope: Scope | null = null;

  public searchResult: SearchResult | null = null;

  get scopes() {
    return this.data?.scopes || [];
  }
  get noData() {
    if (!this.searchResult) {
      return true;
    }
    return Object.values(this.searchResult).every(items => items.length === 0);
  }
  constructor(
    public dialogRef: MatDialogRef<ScanPackingDialog>,
    @Inject(MAT_DIALOG_DATA) public data?: ScanPackingDialogData
  ) {
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
    if (!model) {
      this._notificationService.addErrorNotification('QR core is not valid (model)');
      this.dialogRef.close();
      return;
    }

    this.step.set('search');
    this._scanPackingService.lookForPacking$(model, id).subscribe({
      next: searchResult => {
        this._processSearchResult(searchResult);

        this.requestState.completed();
      },
      error: () => {
        this.dialogRef.close();
      },
    });
  }
  public getDataByScope(scope: Scope) {
    if (!this.searchResult) {
      return [];
    }
    return this.searchResult[scope.key] || [];
  }
  public setScope(scope: Scope) {
    this.activeScope = scope;

    const list = this.getDataByScope(scope);
    if (list.length === 1) {
      this.navigateTo(scope, list[0]);
    }
  }

  public navigateTo(scope: Scope | null, item: SearchItem) {
    if (!scope) {
      return;
    }
    this._scanPackingService.setActiveScanItem(item);

    scope.navigation(item);
    this.dialogRef.close();
  }

  private _processSearchResult(searchResult: { [index: string]: SearchItem[] }) {
    this.searchResult = searchResult;

    const allEntries = Object.entries(searchResult);
    const totalCount = allEntries.reduce((sum, [, items]) => sum + items.length, 0);

    if (totalCount !== 1) {
      return;
    }

    for (const [key, items] of allEntries) {
      if (items.length > 0) {
        const scope = this._getScopeByKey(key);
        this.navigateTo(scope, items[0]);
        return;
      }
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
