import { Observable, of } from 'rxjs';

import { IInputBase, InputBase } from '../base';

export interface IInputButton extends IInputBase<any> {
  callback?: Function;
  disabled$?: Observable<boolean>;
  style?:  'primary' | 'secondary' | 'danger';
}
export class InputButton extends InputBase<any> {
  override controlType = 'button';
  public callback: Function = () => {};
  public disabled$?: Observable<boolean> = of(false);
  public style:  'primary' | 'secondary' | 'danger';

  constructor(options: IInputButton = {}) {
    super(options);

    if (options.callback) {
      this.callback = options.callback;
    }
    if (options.disabled$) {
      this.disabled$ = options.disabled$;
    }
    this.style = options.style ?? 'primary';
  }
}
