import { BydPermissionLevel } from '@beyond/server';
import { BydAbstractComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class GuardComponent extends BydAbstractComponent {
    level: BydPermissionLevel;
    feature: string;
    canDisplayErrorMessage: boolean;
    private readonly _permissionsServices;
    constructor();
    isGuardValid(): boolean;
    goToLogin(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GuardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GuardComponent, "cam-guard", never, { "level": { "alias": "level"; "required": false; }; "feature": { "alias": "feature"; "required": false; }; "canDisplayErrorMessage": { "alias": "canDisplayErrorMessage"; "required": false; }; }, {}, never, ["*"], true, never>;
}
