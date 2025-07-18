import { EToast } from './helpers';
import * as i0 from "@angular/core";
export { EToast } from './helpers';
export declare class ToastComponent {
    code: EToast;
    onTop: boolean;
    inMiddle: boolean;
    readonly getTypeClass: (code: EToast) => "" | "danger" | "info" | "warning" | "success";
    static ɵfac: i0.ɵɵFactoryDeclaration<ToastComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ToastComponent, "byd-toast", never, { "code": { "alias": "code"; "required": false; }; "onTop": { "alias": "onTop"; "required": false; }; "inMiddle": { "alias": "inMiddle"; "required": false; }; }, {}, never, ["*"], true, never>;
}
