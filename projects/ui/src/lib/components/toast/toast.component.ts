import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

import { EToast, getTypeClass } from './helpers';

export { EToast } from './helpers';

@Component({
  selector: 'byd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
})
export class ToastComponent {
  @Input()
  code: EToast = EToast.information;

  @Input()
  onTop = false;

  readonly getTypeClass = getTypeClass;
}
