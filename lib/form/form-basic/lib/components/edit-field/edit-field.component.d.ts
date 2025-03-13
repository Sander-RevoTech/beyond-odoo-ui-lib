import { EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { InputBase } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export type Layout = 'row' | 'column';
export declare class EditFieldComponent extends BydBaseComponent implements OnInit, OnChanges {
    layout: Layout;
    getInput: () => InputBase<any>;
    changeEditMode$: Observable<boolean> | null;
    isLoading: boolean;
    newValue: EventEmitter<unknown>;
    height: string;
    withBorder: boolean;
    input: InputBase<any>;
    editMode: boolean;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    toggleEditMode(): void;
    validation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditFieldComponent, "byd-edit-field", never, { "layout": { "alias": "layout"; "required": false; }; "getInput": { "alias": "getInput"; "required": false; }; "changeEditMode$": { "alias": "changeEditMode$"; "required": false; }; "isLoading": { "alias": "isLoading"; "required": false; }; "height": { "alias": "height"; "required": false; }; "withBorder": { "alias": "withBorder"; "required": false; }; }, { "newValue": "newValue"; }, never, ["*"], true, never>;
}
