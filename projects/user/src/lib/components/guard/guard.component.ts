import { Component, inject, Input } from '@angular/core';

import { BydMainRoute, BydRoutes } from '@beyond/menu';
import { BydPermissionsServices, BydPermissionLevel } from '@beyond/server';
import { BydButtonComponent } from '@beyond/ui';
import { BydAbstractComponent } from '@beyond/utils';


@Component({
  selector: 'cam-guard',
  templateUrl: './guard.component.html',
  styleUrls: ['./guard.component.scss'],
  imports: [BydButtonComponent],
  standalone: true
})
export class GuardComponent extends BydAbstractComponent {
  @Input()
  level!: BydPermissionLevel;

  @Input()
  feature!: string;

  @Input()
  canDisplayErrorMessage: boolean = true;

  private readonly _permissionsServices = inject(BydPermissionsServices);

  constructor() {
    super();
  }

  public isGuardValid(): boolean {
    return this._permissionsServices.canDirectAccess(this.feature, this.level);
  }

  public goToLogin() {
    this._router.navigateByUrl(BydRoutes.getUrl([BydMainRoute.USERLOGIN]));
  }
}
