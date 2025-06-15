import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { BydCompaniesService } from '@beyond/odoo';
import { CardComponent, CardHeaderComponent, CardTitleComponent } from '@beyond/ui';
import { BydAbstractComponent } from '@beyond/utils';

import { BydUserService } from '../../services/user.service';

@Component({
  selector: 'byd-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss'],
  imports: [AsyncPipe, CardComponent, CardHeaderComponent, CardTitleComponent],
  standalone: true,
})
export class CompanyComponent extends BydAbstractComponent {
  private readonly _usersServices = inject(BydUserService);
  private readonly _companiesServices = inject(BydCompaniesService);

  public dialogRef = inject(MatDialogRef);
  public companies$ = this._companiesServices.companies.get$();

  constructor() {
    super();
    this._companiesServices.fetch$(this._usersServices.company.get() ?? []).subscribe();
  }

  public select(id: number) {
    this._usersServices.permissionsServices.setCompany(id);
    this.dialogRef.close();
    this._router.navigateByUrl('/');
  }
}
