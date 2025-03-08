import { Component, Input } from '@angular/core';

import { TaSizes } from '@beyond/styles';
import { MessageLevel } from '@beyond/utils';
import { PictureInfoMessageComponent } from '../../../components/picture-info-message/picture-info-message.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'byd-empty',
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss'],
  standalone: true,
  imports: [PictureInfoMessageComponent, NgIf]
})
export class EmptyComponent {
  @Input() isEmpty: boolean = true;
  @Input() isLight: boolean = true;
  @Input() showMessage: boolean = true;

  @Input() text?: string = 'container.empty.light-message';
  @Input() type?: MessageLevel = 'info';

  @Input() icon?: string = 'ghost';
  @Input() iconSize?: TaSizes | 'xl';
}
