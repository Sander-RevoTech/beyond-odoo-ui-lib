import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { BydSizes } from '@beyond/styles';

@Component({
  selector: 'byd-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone: true,
  imports: [NgClass, MatIcon],
})
export class BydBadgeComponent {
  @Input()
  value!: string | null;

  @Input()
  type: 'info' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary' = 'primary';

  @Input()
  icon?: string;

  @Input()
  size?: BydSizes = 'xs';

  @Output()
  clickAction = new EventEmitter();

  constructor() {}

  public getClass(): string {
    return `badge-${this.type} badge-size-${this.size}`;
  }
}
