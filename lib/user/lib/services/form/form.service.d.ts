import { InputBase } from '@beyond/form-model';
import * as i0 from "@angular/core";
export declare class AppUserFormService {
    constructor();
    getLoginForm(): InputBase<any>[];
    formatLoginForm(data: any): {
        user: string | null;
        pass: string;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<AppUserFormService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppUserFormService>;
}
