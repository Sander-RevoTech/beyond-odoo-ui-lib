import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BydSizes } from '@beyond/styles';

@Component({
  selector: 'byd-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class BydTextComponent {

  @Input()
  size: BydSizes = 'md';

  @Input()
  isBold: boolean = false;

  @Input()
  color: string = 'primary';

  public getColorClass() {
    return `text-color-text-${this.color}`;
  }
}
