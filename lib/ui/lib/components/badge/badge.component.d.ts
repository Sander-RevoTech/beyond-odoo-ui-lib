import * as i0 from "@angular/core";
export declare class BadgeComponent {
    /**
     * Text to display in badge
     */
    value: string | null;
    /**
     * Style of badge
     */
    type: 'danger' | 'warning' | 'success' | 'primary' | 'secondary';
    constructor();
    getClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<BadgeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BadgeComponent, "app-badge", never, { "value": { "alias": "value"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
