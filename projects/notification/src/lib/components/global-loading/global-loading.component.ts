import { Component, inject } from '@angular/core';

import { LoaderComponent, LogoComponent } from '@beyond/ui';

import { BydNotificationService } from '../../services/notification.service';

@Component({
  selector: 'byd-global-loading',
  imports: [LoaderComponent, LogoComponent],
  templateUrl: './global-loading.component.html',
  styleUrl: './global-loading.component.scss',
})
export class BydGlobalLoadingComponent {
  public notificationService = inject(BydNotificationService);
}
