import * as i0 from '@angular/core';
import { Injectable, inject, signal, Component, Input } from '@angular/core';
import { BydFormComponent } from '@beyond/form-basic';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydAuthOdooService, BydBaseOdooService, BydEmployeeService } from '@beyond/odoo';
import { LoaderComponent, BydButtonComponent } from '@beyond/ui';
import { BydBaseComponent, BydAbstractComponent, isNonNullable, getFirstNumber } from '@beyond/utils';
import { Validators } from '@angular/forms';
import { InputCheckBox, InputPanel, InputEmail, InputPassword } from '@beyond/form-model';
import { startWith, map, mergeMap, of, filter, tap, switchMap } from 'rxjs';
import { BydRoutes, BydMainRoute } from '@beyond/menu';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { MatDialog } from '@angular/material/dialog';
import * as i1 from '@angular/router';
import { map as map$1 } from 'rxjs/operators';

class AppUserFormService {
    constructor() { }
    getLoginForm() {
        const asAdmin = new InputCheckBox({
            key: 'asAdmin',
            label: 'Login as admin',
            class: 'col-sm-12',
            toggle: true,
        });
        return [
            new InputPanel({
                key: 'panel',
                label: '',
                class: 'col-sm-12',
                children: [
                    asAdmin,
                    new InputEmail({
                        key: 'email',
                        label: 'Email',
                        validators: [Validators.required],
                        visible$: asAdmin.changeValue$.pipe(startWith(false), map(value => !value)),
                    }),
                    new InputPassword({
                        key: 'password',
                        label: 'Password',
                        validators: [Validators.required],
                    }),
                ],
            }),
        ];
    }
    formatLoginForm(data) {
        return {
            user: data.email ?? null,
            pass: data.password,
        };
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppUserFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppUserFormService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppUserFormService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class LoginCardComponent extends BydBaseComponent {
    _authService = inject(BydAuthOdooService);
    _notificationService = inject(BydNotificationService);
    _formService = inject(AppUserFormService);
    form = signal(this._formService.getLoginForm());
    constructor() {
        super();
    }
    login(data) {
        this.requestState.asked();
        const loginData = this._formService.formatLoginForm(data);
        this._authService.login$({ identifier: loginData.user, password: loginData.pass }).subscribe({
            next: uid => {
                this.requestState.completed();
                if (uid) {
                    this._successMessage();
                }
                else {
                    this._errorMessage('notification.success');
                }
            },
            error: (message) => {
                this.requestState.completed();
                this._errorMessage(message);
            },
        });
    }
    _successMessage() {
        this._notificationService.addNotification('notification.success', ENotificationCode.success);
        this._router.navigateByUrl('/');
    }
    _errorMessage(message) {
        this._notificationService.addNotification(message, ENotificationCode.error);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LoginCardComponent, isStandalone: true, selector: "byd-login-card", usesInheritance: true, ngImport: i0, template: "<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <byd-form [inputs]=\"this.form()\" (valid)=\"this.login($event)\"></byd-form>\r\n</byd-loader>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-login-card', imports: [LoaderComponent, BydFormComponent], standalone: true, template: "<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <byd-form [inputs]=\"this.form()\" (valid)=\"this.login($event)\"></byd-form>\r\n</byd-loader>\r\n" }]
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: GuardComponent, isStandalone: true, selector: "byd-guard", inputs: { level: "level", feature: "feature", canDisplayErrorMessage: "canDisplayErrorMessage" }, usesInheritance: true, ngImport: i0, template: "<div class=\"guard\">\r\n  @if (this.isGuardValid()) {\r\n    <div class=\"guard-valid\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n  } @else if (!this.isGuardValid() && this.canDisplayErrorMessage) {\r\n    <div class=\"guard-no-valid ta-c\">\r\n      <!-- <cam-font-icon name=\"close-tool\" size=\"md\"></cam-font-icon> -->\r\n      {{ 'container.guard.content' }}\r\n\r\n      @if (this.level === 'authenticated') {\r\n        <byd-button (action)=\"this.goToLogin()\"> Me connecter </byd-button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: GuardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-guard', imports: [BydButtonComponent], standalone: true, template: "<div class=\"guard\">\r\n  @if (this.isGuardValid()) {\r\n    <div class=\"guard-valid\">\r\n      <ng-content></ng-content>\r\n    </div>\r\n  } @else if (!this.isGuardValid() && this.canDisplayErrorMessage) {\r\n    <div class=\"guard-no-valid ta-c\">\r\n      <!-- <cam-font-icon name=\"close-tool\" size=\"md\"></cam-font-icon> -->\r\n      {{ 'container.guard.content' }}\r\n\r\n      @if (this.level === 'authenticated') {\r\n        <byd-button (action)=\"this.goToLogin()\"> Me connecter </byd-button>\r\n      }\r\n    </div>\r\n  }\r\n</div>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { level: [{
                type: Input
            }], feature: [{
                type: Input
            }], canDisplayErrorMessage: [{
                type: Input
            }] } });

class BydUserService extends BydBaseOdooService {
    profile$ = new HandleSimpleRequest();
    warehouse$ = new HandleSimpleRequest();
    permissionsServices = inject(BydPermissionsServices);
    employeesServices = inject(BydEmployeeService);
    constructor() {
        super();
        this.permissionsServices.updated$.pipe(mergeMap(() => this.fetchProfile$())).subscribe();
    }
    fetchProfile$() {
        if (!this.permissionsServices.uid) {
            return of(null);
        }
        return this.profile$.fetch(this._odooService
            .searchRead$('res.users', [['id', '=', this.permissionsServices.uid]], ['id', 'email', 'display_name', 'share', 'groups_id', 'employee_id'])
            .pipe(filter(isNonNullable), map(result => result[0]), tap(profile => {
            this.permissionsServices.setRole(profile.share ? 'shared' : 'interne');
        }), switchMap((profile) => {
            return this.warehouse$
                .fetch(this.employeesServices
                .getWarehouses$(getFirstNumber(profile.employee_id) ?? 0)
                .pipe(filter(isNonNullable)))
                .pipe(map(() => profile));
        })));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUserService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUserService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUserService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class WarehouseComponent extends BydAbstractComponent {
    _usersServices = inject(BydUserService);
    constructor() {
        super();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: WarehouseComponent, isStandalone: true, selector: "byd-warehouse", usesInheritance: true, ngImport: i0, template: "<div class=\"guard\"></div>\r\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-warehouse', imports: [BydButtonComponent], standalone: true, template: "<div class=\"guard\"></div>\r\n" }]
        }], ctorParameters: () => [] });

class WarehouseGuardComponent extends BydAbstractComponent {
    _usersServices = inject(BydUserService);
    _permissionsServices = inject(BydPermissionsServices);
    openDialog = inject(MatDialog);
    constructor() {
        super();
        this._registerSubscription(this._usersServices.warehouse$.get$().subscribe({
            next: warehouses => {
                if (!warehouses) {
                    return;
                }
                if (warehouses.length === 1) {
                    this._permissionsServices.setWarehouse(warehouses[0]);
                    return;
                }
                this.openDialog.open(WarehouseComponent);
            },
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseGuardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: WarehouseGuardComponent, isStandalone: true, selector: "byd-warehouse-guard", usesInheritance: true, ngImport: i0, template: "<div class=\"guard\"></div>\r\n", styles: [""] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseGuardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-warehouse-guard', imports: [BydButtonComponent], standalone: true, template: "<div class=\"guard\"></div>\r\n" }]
        }], ctorParameters: () => [] });

class BydLoginPage {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydLoginPage, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydLoginPage, isStandalone: true, selector: "ng-component", ngImport: i0, template: "<byd-login-card></byd-login-card>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoginCardComponent, selector: "byd-login-card" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydLoginPage, decorators: [{
            type: Component,
            args: [{ selector: '', imports: [LoginCardComponent], standalone: true, template: "<byd-login-card></byd-login-card>\r\n" }]
        }] });

class AuthGuard {
    router;
    _permissionsServices = inject(BydPermissionsServices);
    constructor(router) {
        this.router = router;
    }
    canActivate(next, state) {
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
        return this._permissionsServices.updated$.pipe(map$1(() => {
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

export { AuthGuard, BydLoginPage, BydUserService, FeatureGuard, GuardComponent, LoginCardComponent, WarehouseComponent, WarehouseGuardComponent };
//# sourceMappingURL=beyond-user.mjs.map
