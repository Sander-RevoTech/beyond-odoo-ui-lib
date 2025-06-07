import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { BydButtonComponent } from '@beyond/ui';

import { Preset, ViewType } from '../../models/types';
import { BydAbstractGridComponent } from '../abstract.component';
import { BydGridFormComponent } from '../form/form.component';

@Component({
  selector: 'byd-grid-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss'],
  standalone: true,
  imports: [MatIcon, AsyncPipe, MatMenuModule],
})
export class BydGridControlComponent extends BydAbstractGridComponent<any> implements OnInit {
  @Input()
  show: { switchView?: boolean; filters?: boolean; preset?: boolean } = {
    switchView: true,
    filters: true,
    preset: false,
  };

  readonly dialog = inject(MatDialog);

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

  public openFilters() {
    this.dialog.open<FiltersModal, FiltersModalData>(FiltersModal, {
      data: { gridId: this.gridId },
    });
  }
  public setPreset(preset: Preset) {
    this.grid.filters?.apply(preset.filters);
  }
}

interface FiltersModalData {
  gridId: string;
}
@Component({
  selector: '',
  template:
    '<div class="p-space-md"><byd-grid-form [gridId]="this.data.gridId"></byd-grid-form><byd-button (action)="this.close()">Applied</byd-button></div>',
  standalone: true,
  imports: [BydGridFormComponent, BydButtonComponent],
})
export class FiltersModal {
  public readonly dialogRef = inject(MatDialogRef<FiltersModal>);
  public readonly data = inject<FiltersModalData>(MAT_DIALOG_DATA);

  public close() {
    this.dialogRef.close();
  }
}
