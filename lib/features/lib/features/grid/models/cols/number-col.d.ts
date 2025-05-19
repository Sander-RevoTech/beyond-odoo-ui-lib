import { InputPanel } from '@beyond/form-model';
import { Filter } from '../types';
import { BaseCol } from './base-col';
export declare class NumberCol extends BaseCol<Number> {
    getInputForm(): InputPanel;
    formatInputForm(data: any): Filter | null;
}
