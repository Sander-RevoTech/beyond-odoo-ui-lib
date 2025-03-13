import { BydBaseComponent } from '@beyond/utils';
import { ENotificationCode } from '../../../enum';
import { BydNotificationService } from '../../../services/notification.service';
import { EToast } from '@beyond/ui';
import * as i0 from "@angular/core";
export declare class NotificationBoxComponent extends BydBaseComponent {
    private _notificationService;
    list: {
        message: string;
        code: ENotificationCode;
    }[];
    constructor(_notificationService: BydNotificationService);
    getCode(code: ENotificationCode): EToast;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotificationBoxComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NotificationBoxComponent, "byd-notification-box", never, {}, {}, never, never, true, never>;
}
