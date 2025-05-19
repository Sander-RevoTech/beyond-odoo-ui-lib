import { InputDatePicker } from '@beyond/form-model';
import { Filter } from '../types';
import { BaseCol } from './base-col';
export declare class DateCol extends BaseCol<Date> {
    getInputForm(): InputDatePicker;
    formatInputForm(data: any): Filter | null;
}
