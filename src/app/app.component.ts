import { Component, inject } from '@angular/core';

import {
  BydGridComponent,
  BydGridContainerComponent,
  BydGridControlComponent,
  BydGridFormComponent,
  BydGridTagsComponent,
  ColMetaData,
  ParameterType,
} from '@beyond/features';
import { BydEmployeeService } from '@beyond/odoo';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    BydGridComponent,
    BydGridFormComponent,
    BydGridContainerComponent,
    BydGridContainerComponent,
    BydGridTagsComponent,
    BydGridControlComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'beyond-odoo-ui-lib';

  readonly service = inject(BydEmployeeService);
  readonly colsMetaData: ColMetaData[] = [
    {
      name: 'id',
      type: ParameterType.Number,
    },
    {
      name: 'name',
      type: ParameterType.String,
    },
    {
      name: 'move_date',
      type: ParameterType.DateTime,
    },
    {
      name: 'state',
      type: ParameterType.Enum,
      enumValues: ['draft', 'confirmed'],
    },
    {
      name: 'shift_period',
      type: ParameterType.Enum,
      enumValues: ['morning', 'afternoon', 'night'],
    },
    {
      name: 'employee_id',
      type: ParameterType.Relation,
      dataSearch$: (search?: string) =>
        this.service
          .searchByName$(search ?? '')
          .pipe(map(data => data.map(item => ({ id: item.id.toString(), name: item.name, data: item })))),
    },
  ];
}
