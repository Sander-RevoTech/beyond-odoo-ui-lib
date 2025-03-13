import { IInputBase, InputBase } from './base';
export interface IInputDatePicker extends IInputBase<string | Partial<{
    start: Date | null;
    end: Date | null;
}>> {
    minDate?: Date | 'today';
    maxDate?: Date | 'today';
    rangeEnabled?: boolean;
}
export declare class InputDatePicker extends InputBase<Date | Partial<{
    start: Date | null;
    end: Date | null;
}>> {
    minDate: Date | null;
    maxDate: Date | null;
    rangeEnabled: boolean;
    constructor(options?: IInputDatePicker);
    parseDate(date?: Date | 'today'): Date | null;
}
