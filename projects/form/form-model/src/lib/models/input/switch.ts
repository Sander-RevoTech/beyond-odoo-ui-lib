import { map } from 'rxjs/operators';

import { Observable, of } from 'rxjs';

import { IInputBase, InputBase } from './base';

export interface IFormSwitch extends IInputBase<null> {
  matchtype: Observable<'textbox' | 'checkbox' | 'number' | 'datePicker'>;
}

export class InputSwitch extends InputBase<any> {
  contentClass!: string;
  matchtype!: Observable<string>;

  constructor(options: IFormSwitch) {
    super(options);
    this.controlType = 'switch';

    this.matchtype = options.matchtype.pipe(map(type => (this.type = type))) || of('');
  }
}
