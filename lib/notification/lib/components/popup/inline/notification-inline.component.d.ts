import { EventEmitter } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import { ENotificationCode } from '../../../enum';
import * as i0 from "@angular/core";
export declare class NotificationInlineComponent extends BydBaseComponent {
    set message(value: string);
    code: ENotificationCode;
    showClose: boolean;
    askClose: EventEmitter<null>;
    showMessage: boolean;
    get message(): string;
    get isError(): boolean;
    get isWarning(): boolean;
    get isInformation(): boolean;
    get isSuccess(): boolean;
    private _message;
    constructor();
    close: () => void;
    getIcon(): string;
    getTypeClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotificationInlineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NotificationInlineComponent, "byd-notification-inline", never, { "message": { "alias": "message"; "required": false; }; "code": { "alias": "code"; "required": false; }; "showClose": { "alias": "showClose"; "required": false; }; }, { "askClose": "askClose"; }, never, ["*"], true, never>;
}
