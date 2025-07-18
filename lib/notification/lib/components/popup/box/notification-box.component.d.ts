import { MatDialog } from '@angular/material/dialog';
import { EToast } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { ENotificationCode } from '../../../enum';
import * as i0 from "@angular/core";
export declare class NotificationBoxComponent extends BydBaseComponent {
    private _dialog;
    private readonly _notificationService;
    list: {
        message: string;
        code: ENotificationCode;
        options?: {
            focused?: boolean;
        };
    }[];
    userNotif: import("@angular/core").WritableSignal<{
        message: string;
        code: ENotificationCode;
    } | null>;
    constructor(_dialog: MatDialog);
    getCode(code: ENotificationCode): EToast;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotificationBoxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NotificationBoxComponent, "byd-notification-box", never, {}, {}, never, never, true, never>;
}
