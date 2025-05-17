import { Component, Input, OnInit } from '@angular/core';

import { BydAbstractGridComponent } from '../abstract.component';
import { ViewType } from '../../models/types';
import { MatIcon } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'byd-grid-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
  standalone: true,
  imports: [MatIcon, AsyncPipe],
})
export class GridControlComponent extends BydAbstractGridComponent<any> implements OnInit {
  @Input()
  show: { switchView?: boolean; } = { switchView: true };

  constructor() {
    super();
  }

  public override ngOnInit() {
    super.ngOnInit();
    if (this.breakpoints.isMobile && this.show.switchView) {
      this.switchView('card');
    }
  }

  public switchView(type: ViewType) {
    this._grid.switchView(type);
  }

}
