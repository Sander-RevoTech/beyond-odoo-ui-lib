import * as i0 from '@angular/core';
import { Injectable, inject, signal, HostListener, Component, Input } from '@angular/core';
import { BydFormComponent } from '@beyond/form-basic';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydAuthOdooService, BydCompaniesService, BydBaseOdooService, BydEmployeeService, BydWarehousesService } from '@beyond/odoo';
import { LoaderComponent, BydButtonComponent, CardComponent, CardHeaderComponent, CardTitleComponent, EmptyComponent } from '@beyond/ui';
import { BydBaseComponent, BydAbstractComponent, isNonNullable, getFirstNumber } from '@beyond/utils';
import { BehaviorSubject, debounceTime, mergeMap, of, filter, map, switchMap, tap } from 'rxjs';
import { Validators } from '@angular/forms';
import { InputPanel, InputTextBox, InputPassword } from '@beyond/form-model';
import { BydRoutes, BydMainRoute } from '@beyond/menu';
import { BydPermissionsServices, HandleSimpleRequest } from '@beyond/server';
import { AsyncPipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import * as i1 from '@angular/router';
import { map as map$1 } from 'rxjs/operators';

class AppUserFormService {
    constructor() { }
    getLoginForm() {
        /*
        const asAdmin = new InputCheckBox({
          key: 'asAdmin',
          label: 'Login as admin',
          class: 'col-sm-12',
          toggle: false,
        });
        */
        return [
            new InputPanel({
                key: 'panel',
                label: '',
                class: 'col-sm-12',
                children: [
                    /*
                    asAdmin,
                    */
                    new InputTextBox({
                        key: 'email',
                        label: 'Email',
                        validators: [Validators.required],
                        /*
                        visible$: asAdmin.changeValue$.pipe(
                          startWith(false),
                          map(value => !value)
                        ),
                        */
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
    askValidation$ = new BehaviorSubject(null);
    constructor() {
        super();
    }
    handleEnter(event) {
        this.askValidation$.next(null);
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
        // this._router.navigateByUrl('/');
    }
    _errorMessage(message) {
        this._notificationService.addNotification(message, ENotificationCode.error);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LoginCardComponent, isStandalone: true, selector: "byd-login-card", host: { listeners: { "document:keydown.enter": "handleEnter($event)" } }, usesInheritance: true, ngImport: i0, template: "<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <byd-form [inputs]=\"this.form()\" [askValidation$]=\"this.askValidation$\" (valid)=\"this.login($event)\"></byd-form>\r\n</byd-loader>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LoginCardComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-login-card', imports: [LoaderComponent, BydFormComponent], standalone: true, template: "<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <byd-form [inputs]=\"this.form()\" [askValidation$]=\"this.askValidation$\" (valid)=\"this.login($event)\"></byd-form>\r\n</byd-loader>\r\n" }]
        }], ctorParameters: () => [], propDecorators: { handleEnter: [{
                type: HostListener,
                args: ['document:keydown.enter', ['$event']]
            }] } });

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

class CompanyComponent extends BydAbstractComponent {
    _usersServices = inject(BydUserService);
    _companiesServices = inject(BydCompaniesService);
    dialogRef = inject(MatDialogRef);
    companies$ = this._companiesServices.companies.get$();
    constructor() {
        super();
        this.requestState.asked();
        this._companiesServices
            .fetch$(this._usersServices.company.get() ?? [])
            .subscribe({ complete: () => this.requestState.completed(), error: () => this.requestState.completed() });
    }
    select(id) {
        this._usersServices.permissionsServices.setCompany(id);
        this.dialogRef.close();
        this._router.navigateByUrl('/');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CompanyComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: CompanyComponent, isStandalone: true, selector: "byd-company", usesInheritance: true, ngImport: i0, template: "@let companies = this.companies$ | async;\r\n\r\n<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <div class=\"p-space-lg\">\r\n    <byd-empty [isEmpty]=\"!companies || companies.length === 0\" text=\"No company are allow for your user\">\r\n      <div class=\"flex-column g-space-md\">\r\n        @for (company of companies; track company.id) {\r\n          <byd-card (click)=\"this.select(company.id)\">\r\n            <byd-card-header>\r\n              <byd-card-title>\r\n                <h3>{{ company.name }}</h3>\r\n              </byd-card-title>\r\n            </byd-card-header>\r\n          </byd-card>\r\n        }\r\n      </div>\r\n    </byd-empty>\r\n  </div>\r\n</byd-loader>\r\n", styles: [""], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "component", type: CardComponent, selector: "byd-card", inputs: ["highlight", "shadow", "fullHeight", "noContent", "isNew", "type"], outputs: ["click"] }, { kind: "component", type: CardHeaderComponent, selector: "byd-card-header" }, { kind: "component", type: CardTitleComponent, selector: "byd-card-title" }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: EmptyComponent, selector: "byd-empty", inputs: ["isEmpty", "isLight", "showMessage", "text", "type", "icon", "iconSize"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: CompanyComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-company', imports: [AsyncPipe, CardComponent, CardHeaderComponent, CardTitleComponent, LoaderComponent, EmptyComponent], standalone: true, template: "@let companies = this.companies$ | async;\r\n\r\n<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <div class=\"p-space-lg\">\r\n    <byd-empty [isEmpty]=\"!companies || companies.length === 0\" text=\"No company are allow for your user\">\r\n      <div class=\"flex-column g-space-md\">\r\n        @for (company of companies; track company.id) {\r\n          <byd-card (click)=\"this.select(company.id)\">\r\n            <byd-card-header>\r\n              <byd-card-title>\r\n                <h3>{{ company.name }}</h3>\r\n              </byd-card-title>\r\n            </byd-card-header>\r\n          </byd-card>\r\n        }\r\n      </div>\r\n    </byd-empty>\r\n  </div>\r\n</byd-loader>\r\n" }]
        }], ctorParameters: () => [] });

class BydUserService extends BydBaseOdooService {
    profile = new HandleSimpleRequest();
    warehouse = new HandleSimpleRequest();
    company = new HandleSimpleRequest();
    permissionsServices = inject(BydPermissionsServices);
    employeesServices = inject(BydEmployeeService);
    openDialog = inject(MatDialog);
    constructor() {
        super();
        this.permissionsServices.updated$
            .pipe(debounceTime(500), mergeMap(() => this.fetchProfile$()))
            .subscribe();
    }
    fetchProfile$() {
        if (!this.permissionsServices.uid) {
            return of(null);
        }
        return this.profile.fetch(this._odooService
            .searchRead$('res.users', [['id', '=', this.permissionsServices.uid]], ['id', 'email', 'display_name', 'share', 'groups_id', 'employee_id', 'company_ids'])
            .pipe(filter(isNonNullable), map(result => result[0]), switchMap(profile => {
            this.permissionsServices.setRole(profile.share ? 'shared' : 'interne');
            this.company.data$.next(profile.company_ids);
            if (!profile.share) {
                this.permissionsServices.setEmployee(getFirstNumber(profile.employee_id));
                return of(profile);
            }
            else {
                return this.employeesServices.getRelatedByUserId$(profile.id).pipe(tap(employee => this.permissionsServices.setEmployee(employee.id)), map(employee => ({ ...profile, ...{ employee_id: [employee.id, employee.name] } })));
            }
        }), switchMap(profile => {
            if (this.permissionsServices.company) {
                return of(profile);
            }
            return this.openDialog
                .open(CompanyComponent, {
                disableClose: true,
            })
                .afterClosed()
                .pipe(map(() => profile));
        }), switchMap((profile) => {
            return this.warehouse
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
    _warehouseServices = inject(BydWarehousesService);
    dialogRef = inject(MatDialogRef);
    warehouses$ = this._warehouseServices.warehouses.get$();
    constructor() {
        super();
        this.requestState.asked();
        this._warehouseServices
            .fetch$(this._usersServices.warehouse.get() ?? [])
            .subscribe({ complete: () => this.requestState.completed(), error: () => this.requestState.completed() });
    }
    select(id) {
        this._usersServices.permissionsServices.setWarehouse(id);
        this.dialogRef.close();
        location.reload();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: WarehouseComponent, isStandalone: true, selector: "byd-warehouse", usesInheritance: true, ngImport: i0, template: "@let warehouses = this.warehouses$ | async;\r\n\r\n<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <div class=\"p-space-lg\">\r\n    <byd-empty [isEmpty]=\"!warehouses || warehouses.length === 0\" text=\"No warehouse are allow for your user\">\r\n      <div class=\"flex-column g-space-md\">\r\n        @for (warehouse of warehouses; track warehouse.id) {\r\n          <byd-card (click)=\"this.select(warehouse.id)\">\r\n            <byd-card-header>\r\n              <byd-card-title>\r\n                <h3>{{ warehouse.name }}</h3>\r\n              </byd-card-title>\r\n            </byd-card-header>\r\n          </byd-card>\r\n        }\r\n      </div>\r\n    </byd-empty>\r\n  </div>\r\n</byd-loader>\r\n", styles: [""], dependencies: [{ kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "component", type: CardComponent, selector: "byd-card", inputs: ["highlight", "shadow", "fullHeight", "noContent", "isNew", "type"], outputs: ["click"] }, { kind: "component", type: CardHeaderComponent, selector: "byd-card-header" }, { kind: "component", type: CardTitleComponent, selector: "byd-card-title" }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: EmptyComponent, selector: "byd-empty", inputs: ["isEmpty", "isLight", "showMessage", "text", "type", "icon", "iconSize"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-warehouse', imports: [AsyncPipe, CardComponent, CardHeaderComponent, CardTitleComponent, LoaderComponent, EmptyComponent], standalone: true, template: "@let warehouses = this.warehouses$ | async;\r\n\r\n<byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n  <div class=\"p-space-lg\">\r\n    <byd-empty [isEmpty]=\"!warehouses || warehouses.length === 0\" text=\"No warehouse are allow for your user\">\r\n      <div class=\"flex-column g-space-md\">\r\n        @for (warehouse of warehouses; track warehouse.id) {\r\n          <byd-card (click)=\"this.select(warehouse.id)\">\r\n            <byd-card-header>\r\n              <byd-card-title>\r\n                <h3>{{ warehouse.name }}</h3>\r\n              </byd-card-title>\r\n            </byd-card-header>\r\n          </byd-card>\r\n        }\r\n      </div>\r\n    </byd-empty>\r\n  </div>\r\n</byd-loader>\r\n" }]
        }], ctorParameters: () => [] });

class WarehouseGuardComponent extends BydAbstractComponent {
    _usersServices = inject(BydUserService);
    _permissionsServices = inject(BydPermissionsServices);
    openDialog = inject(MatDialog);
    constructor() {
        super();
        this._registerSubscription(this._usersServices.warehouse.get$().subscribe({
            next: warehouses => {
                if (!warehouses) {
                    return;
                }
                if (this._permissionsServices.warehouse) {
                    return;
                }
                this.openDialog.open(WarehouseComponent, {
                    disableClose: true,
                });
            },
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseGuardComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: WarehouseGuardComponent, isStandalone: true, selector: "byd-warehouse-guard", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: WarehouseGuardComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'byd-warehouse-guard',
                    template: '',
                    imports: [],
                    standalone: true,
                }]
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
