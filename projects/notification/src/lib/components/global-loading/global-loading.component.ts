import { Component, inject } from '@angular/core';

import { LogoComponent } from '@beyond/ui';

import { BydNotificationService } from '../../services/notification.service';

@Component({
  selector: 'byd-global-loading',
  imports: [LogoComponent],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.scss',
})
export class BydGlobalLoadingComponent {
  public notificationService = inject(BydNotificationService);
}
