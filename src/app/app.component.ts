import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NotificationBoxComponent } from '@beyond/notification';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationBoxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'beyond-odoo-ui-lib';
}
