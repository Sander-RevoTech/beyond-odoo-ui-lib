import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { InputChoices, InputChoicesOption } from '@beyond/form-model';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export interface ChoicesBottomSheetComponentData {
    input: InputChoices;
}
export interface ChoicesBottomSheetComponentResult {
    id: string;
    name: string;
}
export declare class ChoicesBottomSheetComponent {
    private _bottomSheetRef;
    data: ChoicesBottomSheetComponentData;
    searchValue: string;
    readonly options: Subject<InputChoicesOption[]>;
    constructor(_bottomSheetRef: MatBottomSheetRef<ChoicesBottomSheetComponent, ChoicesBottomSheetComponentResult>, data: ChoicesBottomSheetComponentData);
    choice(data: {
        id: string;
        name: string;
    }): void;
    searchValuechanged(value: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChoicesBottomSheetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChoicesBottomSheetComponent, "ng-component", never, {}, {}, never, never, true, never>;
}
