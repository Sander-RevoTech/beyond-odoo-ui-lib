import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'byd-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone: true,
  imports: [NgClass, MatIcon],
})
export class BydBadgeComponent {
  /**
   * Text to display in badge
   */
  @Input()
  value!: string | null;

  /**
   * Style of badge
   */
  @Input()
  type: 'info' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary' = 'primary';

  @Input()
  icon?: string;

  @Output()
  clickAction = new EventEmitter();

  constructor() {}

  public getClass(): string {
    return `badge-${this.type}`;
  }
}
