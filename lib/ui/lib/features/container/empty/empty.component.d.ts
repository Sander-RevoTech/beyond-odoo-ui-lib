import { BydSizes } from '@beyond/styles';
import { MessageLevel } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class EmptyComponent {
    isEmpty: boolean;
    isLight: boolean;
    showMessage: boolean;
    text?: string;
    type?: MessageLevel;
    icon?: string;
    iconSize?: BydSizes | 'xl';
    static ɵfac: i0.ɵɵFactoryDeclaration<EmptyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmptyComponent, "byd-empty", never, { "isEmpty": { "alias": "isEmpty"; "required": false; }; "isLight": { "alias": "isLight"; "required": false; }; "showMessage": { "alias": "showMessage"; "required": false; }; "text": { "alias": "text"; "required": false; }; "type": { "alias": "type"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "iconSize": { "alias": "iconSize"; "required": false; }; }, {}, never, ["*"], true, never>;
}
