import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BydPermissionsServices } from '@beyond/server';
import { BydAbstractComponent } from '@beyond/utils';

import { BydUserService } from '../../services/user.service';
import { CompanyComponent } from './company.component';

@Component({
  selector: 'byd-company-guard',
  template: '',
  imports: [],
  standalone: true,
})
export class CompanyGuardComponent extends BydAbstractComponent {
  private readonly _usersServices = inject(BydUserService);
  private readonly _permissionsServices = inject(BydPermissionsServices);

  public openDialog = inject(MatDialog);

  constructor() {
    super();

    this._registerSubscription(
      this._usersServices.company.get$().subscribe({
        next: companys => {
          if (!companys) {
            return;
          }
          if (this._permissionsServices.company) {
            return;
          }

          this.openDialog.open(CompanyComponent, {
            disableClose: true,
          });
        },
      })
    );
  }
}
