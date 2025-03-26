import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslatePipe } from '@beyond/utils';

import { PictureInfoMessageComponent } from '../../../components/picture-info-message/picture-info-message.component';

@Component({
  selector: 'byd-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
  standalone: true,
  imports: [TranslatePipe, NgIf, PictureInfoMessageComponent],
})
export class ErrorComponent {
  @Input()
  message = '';

  @Input()
  code = 200;

  constructor() {}
}
