import { Observable } from 'rxjs';
import { IInputDropdown, InputDropdown } from './dropdown';
export type InputChoicesOption = {
    id: string;
    name: string;
    disabled?: boolean;
    data: any;
};
export interface IInputChoices extends IInputDropdown<string> {
    options?: Observable<InputChoicesOption[]>;
    advancedSearch$?: (search?: string) => Observable<InputChoicesOption[]>;
}
export declare class InputChoices extends InputDropdown<string> {
    controlType: string;
    options: Observable<InputChoicesOption[]>;
    advancedSearch$: ((search?: string) => Observable<InputChoicesOption[]>) | null;
    constructor(options?: IInputChoices);
}
