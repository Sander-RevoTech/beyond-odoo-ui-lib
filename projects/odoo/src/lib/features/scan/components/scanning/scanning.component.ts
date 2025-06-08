import { Component, EventEmitter, Output, inject } from '@angular/core';

import { BydNotificationService } from '@beyond/notification';
import { BydBaseComponent } from '@beyond/utils';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'byd-scanning',
  imports: [ZXingScannerModule],
  templateUrl: './scanning.component.html',
  styleUrl: './scanning.component.scss',
})
export class BydScanningComponent extends BydBaseComponent {
  @Output()
  scanSuccess = new EventEmitter<string>();

  @Output()
  error = new EventEmitter();

  private readonly _notificationService = inject(BydNotificationService);

  public permissionResponse(repsonse: boolean) {
    if (!repsonse) {
      this._notificationService.addErrorNotification('Permission not granted');
      this.error.emit();
      return;
    }
  }
}
