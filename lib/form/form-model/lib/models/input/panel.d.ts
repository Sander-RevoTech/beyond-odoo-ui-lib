import { IInputBase, InputBase } from './base';
import { InputLabel } from './label';
type classAvailable = 'with-separator' | 'no-title-space' | 'highlight-title' | string;
export interface IFormPanel extends IInputBase<null> {
    children?: (InputBase<any> | InputLabel)[];
    containerClass?: classAvailable[];
    contentClass?: string;
}
export declare class InputPanel extends InputBase<any> {
    containerClass: classAvailable[];
    contentClass: string;
    constructor(options: IFormPanel);
}
export {};
