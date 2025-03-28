import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { EToast, getTypeClass } from './helpers';

export { EToast } from './helpers';

@Component({
  selector: 'byd-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class ToastComponent {
  @Input()
  code: EToast = EToast.information;

  readonly getTypeClass = getTypeClass;
}
