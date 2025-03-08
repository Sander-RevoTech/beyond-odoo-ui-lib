import { Component, Input } from '@angular/core';

import { TaBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-layout-with-nav',
  templateUrl: './layout-with-nav.component.html',
  styleUrls: ['./layout-with-nav.component.scss'],
  standalone: true,
  imports: []
})
export class LayoutWithNavComponent extends TaBaseComponent {
  @Input()
  type!: string;

  constructor() {
    super();
  }
}
