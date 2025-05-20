import { InputChoices, InputTextBox } from '@beyond/form-model';
import { Filter } from '../types';
import { BaseCol } from './base-col';
export declare class RelationCol extends BaseCol<string> {
    getInputForm(): InputChoices | InputTextBox<string>;
    formatInputForm(data: any): Filter | null;
}
