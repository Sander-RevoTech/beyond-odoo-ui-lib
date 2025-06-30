import { Subject } from 'rxjs';
import { ENotificationCode } from '../enum';
import * as i0 from "@angular/core";
export declare class BydNotificationService {
    id: number;
    readonly pendingBlockedRequest: import("@angular/core").WritableSignal<number>;
    newNotification$: Subject<{
        message: string;
        code: ENotificationCode;
    }>;
    errorNotification$: Subject<{
        message: string;
    }>;
    userNotification$: Subject<{
        message: string;
    }>;
    clearUserNotification$: Subject<unknown>;
    constructor();
    incPendingBlockedRequest(): void;
    decPendingBlockedRequest(): void;
    addNotification(message: string, code: ENotificationCode): void;
    addErrorNotification(message: string): void;
    addUserNotification(message: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydNotificationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydNotificationService>;
}
