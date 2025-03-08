import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'byd-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
  standalone: true,
  imports: [NgClass, NgTemplateOutlet]
})
export class TitleComponent {
  /**
   * Title level
   * Higher value means lower title size
   */
  @Input()
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1;

  /**
   * Title theme
   * If set to true, title will be themed with CSS
   */
  @Input() isTheme: boolean = false;

  @Input() isBold: boolean = false;

  constructor() {}
}
