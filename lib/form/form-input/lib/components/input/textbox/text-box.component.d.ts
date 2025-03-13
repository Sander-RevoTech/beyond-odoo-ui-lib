import { EventEmitter, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { InputNumber, InputTextBox } from '@beyond/form-model';
import * as i0 from "@angular/core";
export declare class TextBoxComponent implements OnInit {
    input: InputTextBox | InputNumber;
    matcher: ErrorStateMatcher;
    valueChanged: EventEmitter<any>;
    space: boolean;
    validators: typeof Validators;
    hide: boolean;
    get isPassword(): boolean;
    constructor();
    ngOnInit(): void;
    onChange(value: any): void;
    iconClicked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TextBoxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TextBoxComponent, "byd-input-textbox", never, { "input": { "alias": "input"; "required": false; }; "matcher": { "alias": "matcher"; "required": false; }; "space": { "alias": "space"; "required": false; }; }, { "valueChanged": "valueChanged"; }, never, never, true, never>;
}
