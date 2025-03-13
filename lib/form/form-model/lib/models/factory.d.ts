import { InputBase } from './input/base';
import { IInputChildrenDynamic } from './input/dynamic';
export type FactoryInputType = 'InputCheckBox' | 'InputRadio' | 'InputColorPicker' | 'InputDropdown' | 'InputImages' | 'InputLabel' | 'InputNumber' | 'InputPanel' | 'InputSchema' | 'InputTextarea' | 'InputTextBox' | 'InputWysiswyg' | 'InputUpload';
export declare class InputFactory {
    static getInput(key: FactoryInputType, options: IInputChildrenDynamic): InputBase<any>;
}
