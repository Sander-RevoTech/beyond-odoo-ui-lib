import { Component } from '@angular/core';

import { LayoutNavComponent } from '../layout-nav/layout-nav.component';
import { LayoutWithNavComponent } from '../with-nav/layout-with-nav.component';

@Component({
  selector: 'byd-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.scss'],
  standalone: true,
  imports: [LayoutWithNavComponent, LayoutNavComponent],
})
export class LayoutPageComponent {}
