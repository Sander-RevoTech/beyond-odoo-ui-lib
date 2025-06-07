import { Component, inject } from '@angular/core';

import { BydPermissionsServices } from '@beyond/server';
import { BydButtonComponent } from '@beyond/ui';
import { BydAbstractComponent } from '@beyond/utils';

import { BydUserService } from '../../services/user.service';

@Component({
  selector: 'byd-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss'],
  imports: [BydButtonComponent],
  standalone: true,
})
export class WarehouseComponent extends BydAbstractComponent {
  private readonly _usersServices = inject(BydUserService);

  constructor() {
    super();
  }
}
