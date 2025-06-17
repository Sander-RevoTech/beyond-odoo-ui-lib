import { NgSwitch, NgSwitchCase, NgClass, NgIf, NgFor } from '@angular/common';
import * as i0 from '@angular/core';
import { signal, Injectable, inject, Inject, Component, EventEmitter, Output, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { tap } from 'rxjs/operators';
import { BydTitleComponent, BydButtonComponent, ToastComponent, BydLinkComponent, LogoComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { Subject, BehaviorSubject } from 'rxjs';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@beyond/translation';

var ENotificationCode;
(function (ENotificationCode) {
    ENotificationCode[ENotificationCode["none"] = 0] = "none";
    ENotificationCode[ENotificationCode["error"] = 1] = "error";
    ENotificationCode[ENotificationCode["warning"] = 2] = "warning";
    ENotificationCode[ENotificationCode["information"] = 3] = "information";
    ENotificationCode[ENotificationCode["success"] = 4] = "success";
})(ENotificationCode || (ENotificationCode = {}));

// export const LAZY_SERVICE_TOKEN = new InjectionToken<TaNotificationService>('TaNotificationService');
class BydNotificationService {
    id = Math.random();
    pendingBlockedRequest = signal(0);
    newNotification$ = new Subject();
    errorNotification$ = new Subject();
    userNotification$ = new Subject();
    constructor() { }
    incPendingBlockedRequest() {
        this.pendingBlockedRequest.set(this.pendingBlockedRequest() + 1);
    }
    decPendingBlockedRequest() {
        this.pendingBlockedRequest.set(this.pendingBlockedRequest() - 1);
    }
    addNotification(message, code) {
        this.newNotification$.next({ message, code });
    }
    addErrorNotification(message) {
        this.errorNotification$.next({ message });
    }
    addUserNotification(message) {
        this.userNotification$.next({ message });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydNotificationService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydNotificationService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydNotificationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class ErrorDialog extends BydBaseComponent {
    dialogRef;
    data;
    _notificationService = inject(BydNotificationService);
    constructor(dialogRef, data) {
        super();
        this.dialogRef = dialogRef;
        this.data = data;
    }
    close() {
        this.dialogRef.close();
    }
    copyContent = async () => {
        try {
            await navigator.clipboard.writeText(this.data?.message ?? '');
            this._notificationService.addNotification('Content copied to clipboard', ENotificationCode.success);
        }
        catch (err) {
            this._notificationService.addNotification('Failed to copy', ENotificationCode.error);
        }
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ErrorDialog, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ErrorDialog, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<div class=\"container p-space-xl\">\r\n  <byd-title>{{ 'core.notification.error.title' | translate }}</byd-title>\r\n  <p>\r\n    {{ this.data?.message }}\r\n  </p>\r\n  <div class=\"grid mb-space-10\">\r\n    <byd-button (action)=\"this.copyContent()\">\r\n      {{ 'core.notification.error.copy' | translate }}\r\n    </byd-button>\r\n    <byd-button (action)=\"this.close()\">\r\n      {{ 'core.notification.error.close' | translate }}\r\n    </byd-button>\r\n  </div>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ErrorDialog, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [BydTitleComponent, BydButtonComponent, TranslatePipe], template: "<div class=\"container p-space-xl\">\r\n  <byd-title>{{ 'core.notification.error.title' | translate }}</byd-title>\r\n  <p>\r\n    {{ this.data?.message }}\r\n  </p>\r\n  <div class=\"grid mb-space-10\">\r\n    <byd-button (action)=\"this.copyContent()\">\r\n      {{ 'core.notification.error.copy' | translate }}\r\n    </byd-button>\r\n    <byd-button (action)=\"this.close()\">\r\n      {{ 'core.notification.error.close' | translate }}\r\n    </byd-button>\r\n  </div>\r\n</div>\r\n" }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }] });

class NotificationInlineComponent extends BydBaseComponent {
    set message(value) {
        this._message = value;
        this.showMessage = !!value;
    }
    code = ENotificationCode.information;
    showClose = true;
    askClose = new EventEmitter();
    showMessage = false;
    get message() {
        return this._message;
    }
    get isError() {
        return this.code === ENotificationCode.error;
    }
    get isWarning() {
        return this.code === ENotificationCode.warning;
    }
    get isInformation() {
        return this.code === ENotificationCode.information;
    }
    get isSuccess() {
        return this.code === ENotificationCode.success;
    }
    _message;
    constructor() {
        super();
    }
    close = () => {
        this.askClose.emit();
    };
    getIcon() {
        if (this.isError) {
            return 'close-tool';
        }
        if (this.isWarning) {
            return 'warning';
        }
        if (this.isSuccess) {
            return 'checked';
        }
        return 'help';
    }
    getTypeClass() {
        if (this.isError) {
            return 'danger';
        }
        else if (this.isWarning) {
            return 'warning';
        }
        else if (this.isInformation) {
            return 'info';
        }
        else if (this.isSuccess) {
            return 'success';
        }
        else {
            return '';
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationInlineComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: NotificationInlineComponent, isStandalone: true, selector: "byd-notification-inline", inputs: { message: "message", code: "code", showClose: "showClose" }, outputs: { askClose: "askClose" }, usesInheritance: true, ngImport: i0, template: "<ng-container *ngIf=\"this.showMessage\">\r\n  <div class=\"notification-container\">\r\n    <div class=\"text\">\r\n      <div class=\"label\" [ngClass]=\"this.getTypeClass()\">\r\n        <mat-icon class=\"mr-space-xs\">{{ this.getIcon() }}</mat-icon>\r\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"!this.message\">\r\n          <ng-container *ngSwitchCase=\"this.isError\">\r\n            {{ 'notification.inline.label.error' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isWarning\">\r\n            {{ 'notification.inline.label.warning' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isInformation\">\r\n            {{ 'notification.inline.label.info' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isSuccess\">\r\n            {{ 'notification.inline.label.success' | translate }}\r\n          </ng-container>\r\n        </ng-container>\r\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"this.message\">\r\n          {{ this.message | translate }}\r\n        </ng-container>\r\n      </div>\r\n    </div>\r\n    <span class=\"close\" (click)=\"this.close()\" *ngIf=\"this.showClose\">\r\n      <mat-icon>close</mat-icon>\r\n    </span>\r\n  </div>\r\n</ng-container>\r\n\r\n<ng-container *ngIf=\"!this.showMessage\">\r\n  <ng-content></ng-content>\r\n</ng-container>\r\n", styles: [".notification-container{position:relative;font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.wrapper{padding:var(--byd-space-sm)}.icon{display:flex;align-items:center}.text .label{display:flex;flex-wrap:wrap;justify-content:flex-start}.text .label.success{color:var(--byd-semantic-token-success)}.text .label.danger{color:var(--byd-semantic-token-alert)}.text .label.warning{color:var(--byd-semantic-token-warning)}.text .label.info{color:var(--byd-semantic-token-link)}.close{position:absolute;top:0;right:0;width:auto;padding:5px;cursor:pointer}\n"], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "directive", type: NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationInlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-notification-inline', standalone: true, imports: [TranslatePipe, NgSwitch, NgSwitchCase, NgClass, NgIf, MatIcon], template: "<ng-container *ngIf=\"this.showMessage\">\r\n  <div class=\"notification-container\">\r\n    <div class=\"text\">\r\n      <div class=\"label\" [ngClass]=\"this.getTypeClass()\">\r\n        <mat-icon class=\"mr-space-xs\">{{ this.getIcon() }}</mat-icon>\r\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"!this.message\">\r\n          <ng-container *ngSwitchCase=\"this.isError\">\r\n            {{ 'notification.inline.label.error' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isWarning\">\r\n            {{ 'notification.inline.label.warning' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isInformation\">\r\n            {{ 'notification.inline.label.info' | translate }}\r\n          </ng-container>\r\n          <ng-container *ngSwitchCase=\"this.isSuccess\">\r\n            {{ 'notification.inline.label.success' | translate }}\r\n          </ng-container>\r\n        </ng-container>\r\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"this.message\">\r\n          {{ this.message | translate }}\r\n        </ng-container>\r\n      </div>\r\n    </div>\r\n    <span class=\"close\" (click)=\"this.close()\" *ngIf=\"this.showClose\">\r\n      <mat-icon>close</mat-icon>\r\n    </span>\r\n  </div>\r\n</ng-container>\r\n\r\n<ng-container *ngIf=\"!this.showMessage\">\r\n  <ng-content></ng-content>\r\n</ng-container>\r\n", styles: [".notification-container{position:relative;font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.wrapper{padding:var(--byd-space-sm)}.icon{display:flex;align-items:center}.text .label{display:flex;flex-wrap:wrap;justify-content:flex-start}.text .label.success{color:var(--byd-semantic-token-success)}.text .label.danger{color:var(--byd-semantic-token-alert)}.text .label.warning{color:var(--byd-semantic-token-warning)}.text .label.info{color:var(--byd-semantic-token-link)}.close{position:absolute;top:0;right:0;width:auto;padding:5px;cursor:pointer}\n"] }]
        }], ctorParameters: () => [], propDecorators: { message: [{
                type: Input
            }], code: [{
                type: Input
            }], showClose: [{
                type: Input
            }], askClose: [{
                type: Output
            }] } });

class NotificationBoxComponent extends BydBaseComponent {
    _dialog;
    _notificationService = inject(BydNotificationService);
    list = [];
    userNotif = signal(null);
    constructor(_dialog) {
        super();
        this._dialog = _dialog;
        this._registerSubscription(this._notificationService.newNotification$
            .pipe(tap(notification => {
            this.list.push(notification);
        }), tap(notification => {
            setTimeout(() => {
                this.list = this.list.filter(item => item !== notification);
            }, 3000);
        }))
            .subscribe());
        this._registerSubscription(this._notificationService.errorNotification$
            .pipe(tap(notification => {
            this._dialog.open(ErrorDialog, {
                data: { message: notification.message, type: 'error' },
            });
        }))
            .subscribe());
        this._registerSubscription(this._notificationService.userNotification$
            .pipe(tap(notification => {
            this.userNotif.set({ message: notification.message, code: ENotificationCode.error });
        }))
            .subscribe());
    }
    getCode(code) {
        return code;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: NotificationBoxComponent, isStandalone: true, selector: "byd-notification-box", usesInheritance: true, ngImport: i0, template: "<div class=\"notification-box_container flex-column g-space-sm\">\r\n  <div *ngFor=\"let item of this.list\">\r\n    <byd-toast [code]=\"this.getCode(item.code)\">\r\n      <byd-notification-inline\r\n        [message]=\"item.message\"\r\n        [code]=\"item.code\"\r\n        [showClose]=\"false\"\r\n      ></byd-notification-inline>\r\n    </byd-toast>\r\n  </div>\r\n  @let userNotif = this.userNotif();\r\n  @if (userNotif) {\r\n    <byd-toast [code]=\"this.getCode(userNotif.code)\" [onTop]=\"true\">\r\n      <div class=\"space-between\">\r\n        {{ userNotif.message }}\r\n        <mat-icon (click)=\"this.userNotif.set(null)\">close</mat-icon>\r\n      </div>\r\n    </byd-toast>\r\n  }\r\n</div>\r\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"], dependencies: [{ kind: "component", type: NotificationInlineComponent, selector: "byd-notification-inline", inputs: ["message", "code", "showClose"], outputs: ["askClose"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: ToastComponent, selector: "byd-toast", inputs: ["code", "onTop"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-notification-box', standalone: true, imports: [NotificationInlineComponent, NgFor, ToastComponent, MatIcon], template: "<div class=\"notification-box_container flex-column g-space-sm\">\r\n  <div *ngFor=\"let item of this.list\">\r\n    <byd-toast [code]=\"this.getCode(item.code)\">\r\n      <byd-notification-inline\r\n        [message]=\"item.message\"\r\n        [code]=\"item.code\"\r\n        [showClose]=\"false\"\r\n      ></byd-notification-inline>\r\n    </byd-toast>\r\n  </div>\r\n  @let userNotif = this.userNotif();\r\n  @if (userNotif) {\r\n    <byd-toast [code]=\"this.getCode(userNotif.code)\" [onTop]=\"true\">\r\n      <div class=\"space-between\">\r\n        {{ userNotif.message }}\r\n        <mat-icon (click)=\"this.userNotif.set(null)\">close</mat-icon>\r\n      </div>\r\n    </byd-toast>\r\n  }\r\n</div>\r\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"] }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });

class BydPwaService {
    isPWaCapability$ = new BehaviorSubject(false);
    _promptEvent;
    constructor() {
        window.addEventListener('beforeinstallprompt', event => {
            this._promptEvent = event;
            this.isPWaCapability$.next(true);
        });
    }
    isPWaCapability() {
        return !!this._promptEvent;
    }
    launchInstall() {
        if (this._promptEvent) {
            this._promptEvent.prompt();
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPwaService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPwaService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPwaService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class PwaComponent extends BydBaseComponent {
    show = false;
    _pwa = inject(BydPwaService);
    constructor() {
        super();
        this._registerSubscription(this._pwa.isPWaCapability$.subscribe(is => (this.show = is)));
    }
    install() {
        this._pwa.launchInstall();
    }
    snooze() {
        this.close();
    }
    close() {
        this.show = false;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PwaComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: PwaComponent, isStandalone: true, selector: "app-pwa", usesInheritance: true, ngImport: i0, template: "@if (this.show) {\r\n  <div class=\"installer-container grid align-items-center\">\r\n    <div class=\"g-col-9 ta-c\">\r\n      <div>\r\n        <byd-logo></byd-logo>\r\n      </div>\r\n      <byd-title [level]=\"2\" class=\"mt-space-sm\">{{ 'core.pwa.title' | translate }} </byd-title>\r\n    </div>\r\n\r\n    <div class=\"g-col-3\">\r\n      <div class=\"ta-c\">\r\n        <div>\r\n          <byd-button [type]=\"'secondary'\" (action)=\"this.install()\"> {{ 'core.pwa.install' | translate }} </byd-button>\r\n        </div>\r\n        <div class=\"mt-space-sm\">\r\n          <byd-link (click)=\"this.snooze()\">\r\n            {{ 'core.pwa.cancel' | translate }}\r\n          </byd-link>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n}\r\n", styles: [".installer-container{position:fixed;bottom:0;left:0;right:0;padding:10px;background-color:var(--byd-surface-brand-primary);color:var(--byd-text-invert-primary);box-shadow:var(--byd-shadow-black-sm)}.installer-container img{margin:auto}\n"], dependencies: [{ kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: BydLinkComponent, selector: "byd-link" }, { kind: "component", type: LogoComponent, selector: "byd-logo", inputs: ["type"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: PwaComponent, decorators: [{
            type: Component,
            args: [{ selector: 'app-pwa', imports: [BydTitleComponent, BydButtonComponent, TranslatePipe, BydLinkComponent, LogoComponent], template: "@if (this.show) {\r\n  <div class=\"installer-container grid align-items-center\">\r\n    <div class=\"g-col-9 ta-c\">\r\n      <div>\r\n        <byd-logo></byd-logo>\r\n      </div>\r\n      <byd-title [level]=\"2\" class=\"mt-space-sm\">{{ 'core.pwa.title' | translate }} </byd-title>\r\n    </div>\r\n\r\n    <div class=\"g-col-3\">\r\n      <div class=\"ta-c\">\r\n        <div>\r\n          <byd-button [type]=\"'secondary'\" (action)=\"this.install()\"> {{ 'core.pwa.install' | translate }} </byd-button>\r\n        </div>\r\n        <div class=\"mt-space-sm\">\r\n          <byd-link (click)=\"this.snooze()\">\r\n            {{ 'core.pwa.cancel' | translate }}\r\n          </byd-link>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n}\r\n", styles: [".installer-container{position:fixed;bottom:0;left:0;right:0;padding:10px;background-color:var(--byd-surface-brand-primary);color:var(--byd-text-invert-primary);box-shadow:var(--byd-shadow-black-sm)}.installer-container img{margin:auto}\n"] }]
        }], ctorParameters: () => [] });

class BydGlobalLoadingComponent {
    notificationService = inject(BydNotificationService);
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGlobalLoadingComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydGlobalLoadingComponent, isStandalone: true, selector: "byd-global-loading", ngImport: i0, template: "@if (this.notificationService.pendingBlockedRequest() > 0) {\r\n  <div class=\"global-loading-container\">\r\n    <byd-logo></byd-logo>\r\n    <byd-loader [isLoading]=\"true\"></byd-loader>\r\n  </div>\r\n}\r\n", styles: [".global-loading-container{position:fixed;inset:0;background-color:var(--byd-surface-brand-primary);opacity:.5;z-index:600;display:flex}.global-loading-container byd-logo{display:flex;margin:auto;width:25vw}\n"], dependencies: [{ kind: "component", type: LogoComponent, selector: "byd-logo", inputs: ["type"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydGlobalLoadingComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-global-loading', imports: [LogoComponent, LoaderComponent], template: "@if (this.notificationService.pendingBlockedRequest() > 0) {\r\n  <div class=\"global-loading-container\">\r\n    <byd-logo></byd-logo>\r\n    <byd-loader [isLoading]=\"true\"></byd-loader>\r\n  </div>\r\n}\r\n", styles: [".global-loading-container{position:fixed;inset:0;background-color:var(--byd-surface-brand-primary);opacity:.5;z-index:600;display:flex}.global-loading-container byd-logo{display:flex;margin:auto;width:25vw}\n"] }]
        }] });

/*
 * Public API Surface of notification
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydGlobalLoadingComponent, BydNotificationService, ENotificationCode, NotificationBoxComponent, NotificationInlineComponent, PwaComponent };
//# sourceMappingURL=beyond-notification.mjs.map
