import { TaSizes } from '@beyond/styles';
import { MessageLevel } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class PictureInfoMessageComponent {
    icon?: string;
    iconSize?: TaSizes;
    text?: string;
    type?: MessageLevel;
    get displayedText(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<PictureInfoMessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PictureInfoMessageComponent, "byd-picture-info-message", never, { "icon": { "alias": "icon"; "required": false; }; "iconSize": { "alias": "iconSize"; "required": false; }; "text": { "alias": "text"; "required": false; }; "type": { "alias": "type"; "required": false; }; }, {}, never, never, true, never>;
}
