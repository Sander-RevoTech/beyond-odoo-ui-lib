import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';

import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-layout-with-panel',
  templateUrl: './layout-with-panel.component.html',
  styleUrls: ['./layout-with-panel.component.scss'],
  standalone: true,
  imports: [MatDrawer, MatDrawerContainer, MatIcon, NgClass, NgTemplateOutlet, AsyncPipe],
})
export class BydLayoutWithPanelComponent extends BydBaseComponent implements OnChanges, AfterViewInit {
  @Input()
  open!: boolean;

  @Input()
  width: string = '100%';

  @Output()
  close = new EventEmitter();

  @ViewChild('drawer') drawer: MatDrawer | null = null;
  @ViewChild('layoutPanel') layoutPanel!: TemplateRef<any>;

  readonly dialog = inject(MatDialog);

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
      this.toOpen();
    } else {
      this.toClose();
    }
  }

  public toOpen() {
    if (this.isMobileDevice$.getValue()) {
      this._registerSubscription(
        this.dialog
          .open(this.layoutPanel, {
            panelClass: 'full-modal',
          })
          .afterClosed()
          .subscribe(() => this.close.emit())
      );
    } else {
      this.drawer?.open();
    }
  }
  public toClose() {
    if (this.isMobileDevice$.getValue()) {
      this.dialog.closeAll();
    } else {
      this.drawer?.close();
    }
  }
}
