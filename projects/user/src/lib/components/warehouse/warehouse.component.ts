import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BydWarehousesService } from '@beyond/odoo';
import { CardComponent, CardHeaderComponent, CardTitleComponent, EmptyComponent, LoaderComponent } from '@beyond/ui';
import { BydAbstractComponent } from '@beyond/utils';

import { BydUserService } from '../../services/user.service';

@Component({
  selector: 'byd-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  imports: [AsyncPipe, CardComponent, CardHeaderComponent, CardTitleComponent, LoaderComponent, EmptyComponent],
  standalone: true,
})
export class WarehouseComponent extends BydAbstractComponent {
  private readonly _usersServices = inject(BydUserService);
  private readonly _warehouseServices = inject(BydWarehousesService);

  public dialogRef = inject(MatDialogRef);
  public warehouses$ = this._warehouseServices.warehouses.get$();

  constructor() {
    super();
    this.requestState.asked();

    this._warehouseServices
      .fetch$(this._usersServices.warehouse.get() ?? [])
      .subscribe({ complete: () => this.requestState.completed(), error: () => this.requestState.completed() });
  }

  public select(id: number) {
    this._usersServices.permissionsServices.setWarehouse(id);
    this.dialogRef.close();
    location.reload();
  }
}
