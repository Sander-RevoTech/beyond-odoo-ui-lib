import { EventEmitter, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { InputDropdown } from '@beyond/form-model';
import { BydBaseComponent } from '@beyond/utils';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class DropdownComponent extends BydBaseComponent implements OnInit {
    input: InputDropdown<any>;
    matcher: ErrorStateMatcher;
    space: boolean;
    valueChanged: EventEmitter<any>;
    validators: typeof Validators;
    filteredOptions$: Observable<{
        id: string;
        name: string;
        disabled?: boolean;
    }[]> | null;
    constructor();
    ngOnInit(): void;
    onChange(value: any): void;
    private _filter;
    static ɵfac: i0.ɵɵFactoryDeclaration<DropdownComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DropdownComponent, "byd-input-dropdown", never, { "input": { "alias": "input"; "required": false; }; "matcher": { "alias": "matcher"; "required": false; }; "space": { "alias": "space"; "required": false; }; }, { "valueChanged": "valueChanged"; }, never, never, true, never>;
}
