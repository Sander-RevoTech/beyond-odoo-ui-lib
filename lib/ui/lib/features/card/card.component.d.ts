import { EventEmitter } from '@angular/core';
import { ColorType } from '@beyond/styles';
import * as i0 from "@angular/core";
export declare class CardComponent {
    highlight: boolean;
    shadow: boolean;
    fullHeight: boolean;
    noContent: boolean;
    isNew: boolean;
    type: ColorType;
    click: EventEmitter<any>;
    hasHandler: boolean;
    ngOnInit(): void;
    constructor();
    clickTrigger(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CardComponent, "byd-card", never, { "highlight": { "alias": "highlight"; "required": false; }; "shadow": { "alias": "shadow"; "required": false; }; "fullHeight": { "alias": "fullHeight"; "required": false; }; "noContent": { "alias": "noContent"; "required": false; }; "isNew": { "alias": "isNew"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, { "click": "click"; }, never, ["byd-card-image", "byd-card-header", "byd-card-content", "byd-card-cta"], true, never>;
}
