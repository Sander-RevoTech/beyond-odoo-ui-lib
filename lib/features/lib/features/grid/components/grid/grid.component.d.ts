import { ElementRef, EventEmitter, Renderer2, TemplateRef } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import * as i0 from "@angular/core";
export declare class BydGridComponent<T extends {
    id: number;
}> extends BydAbstractGridComponent<T> {
    private renderer;
    cardTemplate: TemplateRef<{
        items: T[];
    }>;
    rowClicked: EventEmitter<T>;
    tableElement: ElementRef;
    constructor(renderer: Renderer2);
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydGridComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydGridComponent<any>, "byd-grid", never, { "cardTemplate": { "alias": "cardTemplate"; "required": false; }; }, { "rowClicked": "rowClicked"; }, never, never, true, never>;
}
