import { AsyncPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { InputPanel } from '@beyond/form-model';
import { TranslatePipe } from '@beyond/translation';
import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-form-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgTemplateOutlet, NgClass, AsyncPipe, TranslatePipe],
})
export class PanelComponent extends BydBaseComponent {
  @Input()
  public inputsTemplate!: TemplateRef<any>;

  @Input() panel!: InputPanel;

  constructor() {
    super();
  }
}
