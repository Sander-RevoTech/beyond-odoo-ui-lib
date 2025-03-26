import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { BydState } from '@beyond/styles';
import { StopPropagationDirective } from '@beyond/utils';

@Component({
  selector: 'byd-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [NgClass, StopPropagationDirective],
})
export class BydButtonComponent {
  /**
   * Is button type
   */
  @Input()
  state: BydState = 'classic';

  /**
   * Indicate the button type
   */
  @Input()
  type: 'primary' | 'secondary' | 'danger' = 'primary';

  @Input()
  size: 'small' | 'medium' | 'large' = 'medium';

  @Input()
  icon: string | null = null;
  /**
   * Class - Add custom classes separates by space
   * Outline - Draw a border around the button when true
   * Rounded - Make button rounded when true
   * Circular - Make button circular when true
   */
  @Input()
  options: {
    class?: string;
    circular?: boolean | 'big' | 'small';
    border?: boolean;
  } | null = null;

  @Input()
  stopPropagationActivation = true;

  /**
   * Event emitted when button is clicked
   */
  @Output()
  action = new EventEmitter();

  constructor() {}

  public handleClick() {
    if (this.state === 'classic') {
      this.action.emit();
    }
  }

  public getClass() {
    const css: { [index: string]: boolean } = {};

    css[this.state] = true;
    css[this.size] = true;
    css[this.type] = true;

    if (this.options?.circular === true) {
      css['circular'] = true;
    }
    if (this.options?.circular === 'big') {
      css['circular big'] = true;
    }
    if (this.options?.circular === 'small') {
      css['circular small'] = true;
    }
    if (this.options?.class) {
      css[this.options.class] = true;
    }
    if (this.options?.border === false) {
      css['no-border'] = true;
    }

    return css;
  }
}
