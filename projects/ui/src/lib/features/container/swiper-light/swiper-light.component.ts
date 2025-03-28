import { NgClass } from '@angular/common';
import { Component, Input, OnInit, TemplateRef } from '@angular/core';

import { BydBaseComponent } from '@beyond/utils';

@Component({
  selector: 'byd-swiper-light',
  templateUrl: './swiper-light.component.html',
  styleUrls: ['./swiper-light.component.scss'],
  standalone: true,
  imports: [NgClass],
})
export class SwiperLightComponent extends BydBaseComponent implements OnInit {
  @Input()
  items!: { key: string }[];

  @Input()
  template!: TemplateRef<any>;

  @Input()
  swiperClasses = 'g-space-sm';

  @Input()
  containerClasses?: string;

  @Input()
  forced?: boolean = true;

  public classes: string = '';

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.forced) {
      this.classes = `items ${this.swiperClasses ?? ''}`;
    } else {
      // this._registerSubscription(
      //   this._deviceInfoService.os$.subscribe(os => {
      //     this.classes = this._deviceInfoService.isMobileOs(os)
      //       ? `items ${this.swiperClasses ?? ''}`
      //       : this.containerClasses ?? '';
      //   })
      // );
    }
  }
}
