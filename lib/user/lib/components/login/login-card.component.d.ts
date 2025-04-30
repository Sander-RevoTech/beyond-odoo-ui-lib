import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class LoginCardComponent extends BydBaseComponent {
    private readonly _authService;
    private readonly _notificationService;
    private readonly _formService;
    readonly form: import("@angular/core").WritableSignal<import("@beyond/form-model").InputBase<any>[]>;
    constructor();
    login(data: any): void;
    private _successMessage;
    private _errorMessage;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginCardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoginCardComponent, "byd-login-card", never, {}, {}, never, never, true, never>;
}
