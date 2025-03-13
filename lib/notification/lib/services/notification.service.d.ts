import { Subject } from 'rxjs';
import { ENotificationCode } from '../enum';
import * as i0 from "@angular/core";
export declare class BydNotificationService {
    id: number;
    newNotification$: Subject<{
        message: string;
        code: ENotificationCode;
    }>;
    constructor();
    addNotification(message: string, code: ENotificationCode): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydNotificationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydNotificationService>;
}
