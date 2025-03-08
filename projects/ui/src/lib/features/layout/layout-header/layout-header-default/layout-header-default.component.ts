import { Component } from '@angular/core';

import { BydBaseComponent } from '@beyond/utils';
import { TitleComponent } from "../../../../components/title/title.component";
import { LogoComponent } from "../../../../components/logo/logo.component";

@Component({
  selector: 'byd-layout-header-default',
  templateUrl: './layout-header-default.component.html',
  styleUrls: ['./layout-header-default.component.scss'],
  standalone: true,
  imports: [TitleComponent, LogoComponent]
})
export class LayoutHeaderDefaultComponent extends BydBaseComponent {

  public goToHome() {
    this._router.navigateByUrl('/');
  }
}
