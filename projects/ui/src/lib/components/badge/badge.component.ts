import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class BadgeComponent {
  /**
   * Text to display in badge
   */
  @Input()
  value!: string | null;

  /**
   * Style of badge
   */
  @Input()
  type: 'danger' | 'warning' | 'success' | 'primary' | 'secondary' = 'primary';

  constructor() {}

  public getClass(): string {
    return `badge-${this.type}`;
  }
}
