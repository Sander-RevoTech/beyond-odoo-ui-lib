import { Component, inject } from '@angular/core';

import {
  BydGridComponent,
  BydGridContainerComponent,
  BydGridControlComponent,
  BydGridFormComponent,
  BydGridSearchComponent,
  BydGridTagsComponent,
  ParameterType,
} from '@beyond/features';
import { BydEmployeeService, BydPartnersService } from '@beyond/odoo';

import { Preset } from '../../projects/features/src/public-api';
import { BydButtonComponent } from '../../projects/ui/src/lib/components/button/button.component';
import { BydTitleComponent } from '../../projects/ui/src/lib/components/title/title.component';
import { CardComponent } from '../../projects/ui/src/lib/features/card/card.component';
import { CardContentComponent } from '../../projects/ui/src/lib/features/card/content/card-content.component';
import { CardCtaComponent } from '../../projects/ui/src/lib/features/card/cta/card-cta.component';
import { CardHeaderComponent } from '../../projects/ui/src/lib/features/card/header/card-header.component';
import { CardSubtitleComponent } from '../../projects/ui/src/lib/features/card/subtitle/card-subtitle.component';
import { CardTitleComponent } from '../../projects/ui/src/lib/features/card/title/card-title.component';
import { AppTranslationService } from './translations/translation.service';

@Component({
  selector: 'app-root',
  imports: [
    BydGridComponent,
    BydGridFormComponent,
    BydGridContainerComponent,
    BydGridContainerComponent,
    BydGridTagsComponent,
    BydGridControlComponent,
    BydGridSearchComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardSubtitleComponent,
    CardContentComponent,
    CardCtaComponent,
    BydButtonComponent,
    BydTitleComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'beyond-odoo-ui-lib';

  readonly service = inject(BydEmployeeService);
  readonly partnersService = inject(BydPartnersService);

  // readonly colsMetaData: ColMetaData[] = [
  //   {
  //     name: 'id',
  //     type: ParameterType.Number,
  //   },
  //   {
  //     name: 'name',
  //     type: ParameterType.String,
  //   },
  //   {
  //     name: 'move_date',
  //     type: ParameterType.DateTime,
  //   },
  //   {
  //     name: 'state',
  //     type: ParameterType.Enum,
  //     enumValues: ['draft', 'confirmed'],
  //   },
  //   {
  //     name: 'shift_period',
  //     type: ParameterType.Enum,
  //     enumValues: ['morning', 'afternoon', 'night'],
  //   },
  //   {
  //     name: 'employee_id',
  //     type: ParameterType.Relation,
  //     dataSearch$: (search?: string) =>
  //       this.service
  //         .searchByName$(search ?? '')
  //         .pipe(map(data => data.map(item => ({ id: item.id.toString(), name: item.name, data: item })))),
  //   },
  // ];

  readonly colsMetaData = [
    {
      name: 'id',
      type: ParameterType.Number,
    },
    {
      name: 'name',
      type: ParameterType.String,
      isSearchField: true,
    },
    {
      name: 'state',
      type: ParameterType.Enum,
      enumValues: ['draft', 'waiting', 'confirmed', 'assigned', 'done'],
    },
    // {
    //   name: 'partner_id',
    //   type: ParameterType.Relation,
    // },
    // {
    //   name: 'scheduled_date',
    //   type: ParameterType.DateTime,
    // },
  ];
  readonly preset: Preset[] = [
    {
      name: 'draft',
      filters: [
        {
          field: 'state',
          type: '=',
          value: 'draft',
        },
        {
          field: 'name',
          type: 'like',
          value: 'panda',
        },
      ],
    },
    {
      name: 'waiting',
      filters: [
        {
          field: 'state',
          type: '=',
          value: 'waiting',
        },
      ],
    },
    {
      name: 'confirmed',
      filters: [
        {
          field: 'state',
          type: '=',
          value: 'confirmed',
        },
      ],
    },
  ];
  constructor() {
    AppTranslationService.getInstance();
  }
}
