import { Component, Input } from '@angular/core';

@Component({
  selector: 'byd-layout-content',
  templateUrl: './layout-content.component.html',
  styleUrls: ['./layout-content.component.scss'],
  standalone: true,
  imports: []
})
export class LayoutContentComponent {
  @Input()
  autoHeight: boolean = false;

  constructor() {}
}
