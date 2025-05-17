import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BydBadgeComponent {
    /**
     * Text to display in badge
     */
    value: string | null;
    /**
     * Style of badge
     */
    type: 'info' | 'danger' | 'warning' | 'success' | 'primary' | 'secondary';
    icon?: string;
    clickAction: EventEmitter<any>;
    constructor();
    getClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydBadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydBadgeComponent, "byd-badge", never, { "value": { "alias": "value"; "required": false; }; "type": { "alias": "type"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; }, { "clickAction": "clickAction"; }, never, never, true, never>;
}
