import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';
import { IInputDropdown, InputDropdown } from './dropdown';
export type InputChoicesOption = {
    id: string;
    name: string;
    disabled?: boolean;
    data: any;
};
export interface IInputChoices extends IInputDropdown<string[]> {
    onlyTemplate?: boolean;
    options?: Observable<InputChoicesOption[]>;
    advancedSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
    choiceTemplate?: {
        one?: TemplateRef<any>;
        list?: TemplateRef<any>;
    };
}
export declare class InputChoices extends InputDropdown<string[]> {
    controlType: string;
    options: Observable<InputChoicesOption[]>;
    onlyTemplate?: boolean;
    advancedSearch$: ((search?: string) => Observable<InputChoicesOption[]>) | null;
    choiceTemplate?: {
        one?: TemplateRef<any>;
        list?: TemplateRef<any>;
    };
    constructor(options?: IInputChoices);
}
