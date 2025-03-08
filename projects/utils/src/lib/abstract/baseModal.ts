import { Component } from '@angular/core';

import { TaAbstractComponent } from './abstractComponent';

@Component({ template: '' })
export abstract class TaBaseModal extends TaAbstractComponent {
  constructor() {
    super();
  }
}
