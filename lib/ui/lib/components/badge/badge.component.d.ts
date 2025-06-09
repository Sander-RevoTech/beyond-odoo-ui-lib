import { EventEmitter } from '@angular/core';
import { BydSizes } from '@beyond/styles';
import * as i0 from "@angular/core";
export declare class BydBadgeComponent {
    value: string | null;
    type: 'info' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary';
    icon?: string;
    size?: BydSizes;
    clickAction: EventEmitter<any>;
    constructor();
    getClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydBadgeComponent, "byd-badge", never, { "value": { "alias": "value"; "required": false; }; "type": { "alias": "type"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "size": { "alias": "size"; "required": false; }; }, { "clickAction": "clickAction"; }, never, never, true, never>;
}
