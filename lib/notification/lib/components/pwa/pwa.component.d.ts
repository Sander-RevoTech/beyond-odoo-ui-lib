import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class PwaComponent extends BydBaseComponent {
    show: boolean;
    private _pwa;
    constructor();
    install(): void;
    snooze(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PwaComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PwaComponent, "app-pwa", never, {}, {}, never, never, true, never>;
}
