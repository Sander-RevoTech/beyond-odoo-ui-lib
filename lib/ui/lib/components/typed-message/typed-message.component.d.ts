import { MessageLevel } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class TypedMessageComponent {
    text: string;
    type: MessageLevel;
    get icon(): "" | "error_outline" | "check_circle_outline" | "help_outline" | "warning_amber";
    static ɵfac: i0.ɵɵFactoryDeclaration<TypedMessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TypedMessageComponent, "byd-typed-message", never, { "text": { "alias": "text"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
