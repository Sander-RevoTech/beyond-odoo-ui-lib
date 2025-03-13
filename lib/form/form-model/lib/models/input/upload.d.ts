import { IInputBase, InputBase } from './base';
export type InputUploadValue = {
    id: string;
    url: string;
    name?: string;
};
export interface IInputUpload extends IInputBase<InputUploadValue[]> {
    confirmButton?: boolean;
}
export declare class InputUpload extends InputBase<InputUploadValue[]> {
    confirmButton: boolean;
    constructor(options: IInputUpload);
    confirmValue(ids: InputUploadValue[]): void;
}
