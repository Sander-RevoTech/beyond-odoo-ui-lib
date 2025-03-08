import { EventEmitter } from '@angular/core';
import { TaState } from '@beyond/styles';
import * as i0 from "@angular/core";
export declare class TaButtonComponent {
    /**
     * Is button type
     */
    state: TaState;
    /**
     * Indicate the button type
     */
    type: 'primary' | 'secondary' | 'danger';
    size: 'small' | 'medium' | 'large';
    icon: string | null;
    /**
     * Class - Add custom classes separates by space
     * Outline - Draw a border around the button when true
     * Rounded - Make button rounded when true
     * Circular - Make button circular when true
     */
    options: {
        class?: string;
        circular?: boolean | 'big' | 'small';
        border?: boolean;
    } | null;
    stopPropagationActivation: boolean;
    /**
     * Event emitted when button is clicked
     */
    action: EventEmitter<any>;
    constructor();
    handleClick(): void;
    getClass(): {
        [index: string]: boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<TaButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaButtonComponent, "byd-button", never, { "state": { "alias": "state"; "required": false; }; "type": { "alias": "type"; "required": false; }; "size": { "alias": "size"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "options": { "alias": "options"; "required": false; }; "stopPropagationActivation": { "alias": "stopPropagationActivation"; "required": false; }; }, { "action": "action"; }, never, ["*"], true, never>;
}
