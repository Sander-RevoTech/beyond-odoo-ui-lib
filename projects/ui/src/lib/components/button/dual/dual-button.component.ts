import { Component, Input } from '@angular/core';

export interface DualButtonInput {
  icon: string;
  label: string;
  callback: () => void;
}

@Component({
  selector: 'byd-dual-button',
  templateUrl: './dual-button.component.html',
  styleUrls: ['./dual-button.component.scss'],
})
export class DualButtonComponent {
  @Input()
  first!: DualButtonInput;

  @Input()
  second!: DualButtonInput;

  constructor() {}
}
