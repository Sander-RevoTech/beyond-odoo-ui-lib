import { Component } from '@angular/core';

import {
  BydGridComponent,
  BydGridContainerComponent,
  BydGridFormComponent,
  BydGridTagsComponent,
  ParameterType,
} from '@beyond/features';

@Component({
  selector: 'app-root',
  imports: [
    BydGridComponent,
    BydGridFormComponent,
    BydGridContainerComponent,
    BydGridContainerComponent,
    BydGridTagsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'beyond-odoo-ui-lib';

  readonly colsMetaData = [
    {
      name: 'name',
      type: ParameterType.String,
    },
    {
      name: 'id',
      type: ParameterType.Number,
    },
    {
      name: 'lang',
      type: ParameterType.String,
    },
    {
      name: 'login_date',
      type: ParameterType.String,
    },
  ];
}
