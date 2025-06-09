import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export interface IPwaConfig {
    active: boolean;
}
export declare class BydPwaService {
    isPWaCapability$: BehaviorSubject<boolean>;
    private _promptEvent;
    constructor();
    isPWaCapability(): boolean;
    launchInstall(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydPwaService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydPwaService>;
}
