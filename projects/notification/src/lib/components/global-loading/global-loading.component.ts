import { Component, inject } from '@angular/core';

import { BydNotificationService } from '@beyond/notification';
import { LoaderComponent } from '@beyond/ui';

@Component({
  selector: 'byd-global-loading',
  imports: [LoaderComponent],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.css',
})
export class GlobalLoadingComponent {
  public notificationService = inject(BydNotificationService);
}
