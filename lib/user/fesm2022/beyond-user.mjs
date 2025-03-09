import * as i0 from '@angular/core';
import { inject, Component, Input, Injectable } from '@angular/core';
import { BydAuthOdooService } from '@beyond/odoo';
import { CardComponent, CardContentComponent, BydButtonComponent } from '@beyond/ui';
import { BydRoutes, BydMainRoute } from '@beyond/menu';
import { BydPermissionsServices } from '@beyond/server';
import { BydAbstractComponent } from '@beyond/utils';
import { map } from 'rxjs/operators';
import * as i1 from '@angular/router';

class LoginCardComponent {
    _authService = inject(BydAuthOdooService);
    constructor() { }
    login() {
        this._authService.login({
            identifier: 'pikadjou@gmail.com',
            password: 'blacks-159'
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LoginCardComponent, isStandalone: true, selector: "byd-login-card", ngImport: i0, template: "<byd-card (click)=\"this.login()\">\n  <byd-card-content>\n    <byd-button (action)=\"this.login()\">{{ \"user.login\" }}</byd-button>\n  </byd-card-content>\n</byd-card>\n", styles: [""], dependencies: [{ kind: "component", type: CardComponent, selector: "byd-card", inputs: ["highlight", "shadow", "fullHeight", "noContent", "isNew"], outputs: ["click"] }, { kind: "component", type: CardContentComponent, selector: "byd-card-content" }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-login-card', imports: [CardComponent, CardContentComponent, BydButtonComponent], standalone: true, template: "<byd-card (click)=\"this.login()\">\n  <byd-card-content>\n    <byd-button (action)=\"this.login()\">{{ \"user.login\" }}</byd-button>\n  </byd-card-content>\n</byd-card>\n" }]
        }], ctorParameters: () => [] });

class GuardComponent extends BydAbstractComponent {
    level;
    feature;
    canDisplayErrorMessage = true;
    _permissionsServices = inject(BydPermissionsServices);
    constructor() {
        super();
    }
    isGuardValid() {
        return this._permissionsServices.canDirectAccess(this.feature, this.level);
    }
    goToLogin() {
        this._router.navigateByUrl(BydRoutes.getUrl([BydMainRoute.USERLOGIN]));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: GuardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: GuardComponent, isStandalone: true, selector: "cam-guard", inputs: { level: "level", feature: "feature", canDisplayErrorMessage: "canDisplayErrorMessage" }, usesInheritance: true, ngImport: i0, template: "<div class=\"guard\">\n  @if(this.isGuardValid()) {\n  <div class=\"guard-valid\">\n    <ng-content></ng-content>\n  </div>\n  } @else if(!this.isGuardValid() && this.canDisplayErrorMessage) {\n  <div class=\"guard-no-valid ta-c\">\n    <!-- <cam-font-icon name=\"close-tool\" size=\"md\"></cam-font-icon> -->\n    {{ \"container.guard.content\" }}\n\n    @if(this.level === 'authenticated') {\n    <byd-button (action)=\"this.goToLogin()\"> Me connecter </byd-button>\n    }\n  </div>\n  }\n</div>\n", styles: [""], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: GuardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'cam-guard', imports: [BydButtonComponent], standalone: true, template: "<div class=\"guard\">\n  @if(this.isGuardValid()) {\n  <div class=\"guard-valid\">\n    <ng-content></ng-content>\n  </div>\n  } @else if(!this.isGuardValid() && this.canDisplayErrorMessage) {\n  <div class=\"guard-no-valid ta-c\">\n    <!-- <cam-font-icon name=\"close-tool\" size=\"md\"></cam-font-icon> -->\n    {{ \"container.guard.content\" }}\n\n    @if(this.level === 'authenticated') {\n    <byd-button (action)=\"this.goToLogin()\"> Me connecter </byd-button>\n    }\n  </div>\n  }\n</div>\n" }]
        }], ctorParameters: () => [], propDecorators: { level: [{
                type: Input
            }], feature: [{
                type: Input
            }], canDisplayErrorMessage: [{
                type: Input
            }] } });

class AuthGuard {
    router;
    _permissionsServices = inject(BydPermissionsServices);
    constructor(router) {
        this.router = router;
    }
    canActivate(next, state) {
        if (!this._permissionsServices.received) {
            return this._permissionsServices.updated$.pipe(map(() => {
                if (this._permissionsServices.isAuthenticated) {
                    return true;
                }
                else {
                    this.setRedirect();
                    return false;
                }
            }));
        }
        if (this._permissionsServices.isAuthenticated === false) {
            this.setRedirect();
            return false;
        }
        return this._permissionsServices.isAuthenticated;
    }
    setRedirect() {
        this.router.navigateByUrl(BydRoutes.getLogin());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AuthGuard, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AuthGuard, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AuthGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.Router }] });

class FeatureGuard {
    router;
    _permissionsServices = inject(BydPermissionsServices);
    constructor(router) {
        this.router = router;
    }
    canActivate(route) {
        const level = route.data['level'];
        const feature = route.data['feature'];
        if (this._permissionsServices.received === true) {
            return this._isValidPermission(feature, level);
        }
        return this._permissionsServices.updated$.pipe(map(() => {
            return this._isValidPermission(feature, level);
        }));
    }
    setRedirect() {
        this.router.navigateByUrl(BydRoutes.getHome());
    }
    _isValidPermission(feature, level) {
        if (this._permissionsServices.canDirectAccess(feature, level)) {
            return true;
        }
        this.setRedirect();
        return false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FeatureGuard, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FeatureGuard, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: FeatureGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.Router }] });

/*
 * Public API Surface of users
 */

/*
 * Public API Surface of users
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AuthGuard, FeatureGuard, GuardComponent, LoginCardComponent };
//# sourceMappingURL=beyond-user.mjs.map
