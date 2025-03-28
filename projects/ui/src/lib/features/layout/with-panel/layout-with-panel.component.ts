import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';

import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-layout-with-panel',
  templateUrl: './layout-with-panel.component.html',
  styleUrls: ['./layout-with-panel.component.scss'],
  standalone: true,
  imports: [MatDrawer, MatDrawerContainer, MatIcon, NgClass],
})
export class BydLayoutWithPanelComponent extends BydBaseComponent implements OnChanges, AfterViewInit {
  @Input()
  open!: boolean;

  @Input()
  width: string = '100%';

  @Output()
  close = new EventEmitter();

  @ViewChild('drawer') drawer: MatDrawer | null = null;

  constructor() {
    super();
  }

  public ngAfterViewInit() {
    this.manageDrawer();
    if (this.drawer) {
      this._registerSubscription(this.drawer.closedStart.subscribe(() => this.close.emit()));
    }
  }
  public ngOnChanges(changes: SimpleChanges) {
    this.manageDrawer();
  }

  public manageDrawer() {
    if (this.open === true) {
      this.drawer?.open();
    } else {
      this.drawer?.close();
    }
  }
}
