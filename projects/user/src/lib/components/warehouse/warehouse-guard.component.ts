import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BydPermissionsServices } from '@beyond/server';
import { BydButtonComponent } from '@beyond/ui';
import { BydAbstractComponent } from '@beyond/utils';

import { BydUserService } from '../../services/user.service';
import { WarehouseComponent } from './warehouse.component';

@Component({
  selector: 'byd-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  imports: [BydButtonComponent],
  standalone: true,
})
export class GuardComponent extends BydAbstractComponent {
  private readonly _usersServices = inject(BydUserService);
  private readonly _permissionsServices = inject(BydPermissionsServices);

  public openDialog = inject(MatDialog);

  constructor() {
    super();

    this._registerSubscription(
      this._usersServices.warehouse$.get$().subscribe({
        next: warehouses => {
          if (!warehouses) {
            return;
          }
          if (warehouses.length === 1) {
            this._permissionsServices.setWarehouse(warehouses[0]);
            return;
          }

          this.openDialog.open(WarehouseComponent);
        },
      })
    );
  }
}
