import { Component } from '@angular/core';

import { BydAbstractComponent } from './abstractComponent';

@Component({ template: '' })
export abstract class BydBaseModal extends BydAbstractComponent {
  constructor() {
    super();
  }
}
