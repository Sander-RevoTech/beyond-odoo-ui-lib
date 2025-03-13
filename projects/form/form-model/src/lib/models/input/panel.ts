import { IInputBase, InputBase } from './base';
import { InputLabel } from './label';

type classAvailable = 'with-separator' | 'no-title-space' | 'highlight-title' | string;

export interface IFormPanel extends IInputBase<null> {
  children?: (InputBase<any> | InputLabel)[];
  containerClass?: classAvailable[];
  contentClass?: string;
}

export class InputPanel extends InputBase<any> {
  containerClass: classAvailable[];
  contentClass: string;
  constructor(options: IFormPanel) {
    super(options);
    this.controlType = 'panel';

    this.containerClass = options.containerClass || [];
    this.contentClass = options.contentClass || '';
    this.children = options.children || [];
  }
}
