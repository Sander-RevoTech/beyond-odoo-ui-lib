import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { StopPropagationDirective } from '@beyond/utils';

@Component({
  selector: 'byd-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [NgClass, StopPropagationDirective],
})
export class CardComponent {
  @Input()
  highlight: boolean = false;

  @Input()
  shadow: boolean = true;

  @Input()
  fullHeight: boolean = false;

  @Input()
  noContent: boolean = false;

  @Input()
  isNew: boolean = false;

  @Output()
  click: EventEmitter<any> = new EventEmitter<any>();

  public hasHandler: boolean = false;

  ngOnInit() {
    this.hasHandler = this.click.observers.length > 0;
  }
  constructor() {}

  public clickTrigger() {
    this.click.emit(null);
  }
}
