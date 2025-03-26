import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BydSizes } from '@beyond/styles';
import { MessageLevel, TranslatePipe } from '@beyond/utils';

// import { MaterialIconComponent } from "@beyond/icons";
import { TypedMessageComponent } from '../typed-message/typed-message.component';

@Component({
  selector: 'byd-picture-info-message',
  templateUrl: './picture-info-message.component.html',
  styleUrls: ['./picture-info-message.component.scss'],
  standalone: true,
  imports: [NgIf, TranslatePipe, TypedMessageComponent],
})
export class PictureInfoMessageComponent {
  @Input() icon?: string;
  @Input() iconSize?: BydSizes;
  @Input() text?: string;
  @Input() type?: MessageLevel = 'info';

  get displayedText() {
    return this.text ?? '';
  }
}
