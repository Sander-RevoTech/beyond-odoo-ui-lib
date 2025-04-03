import { NgSwitch, NgSwitchCase, NgClass, NgIf, NgFor } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, inject, Inject, Component, EventEmitter, Output, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BydTitleComponent, BydButtonComponent, ToastComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { Subject } from 'rxjs';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@beyond/translation';
import { MatIcon } from '@angular/material/icon';

// export const LAZY_SERVICE_TOKEN = new InjectionToken<TaNotificationService>('TaNotificationService');
class BydNotificationService {
    id = Math.random();
    newNotification$ = new Subject();
    errorNotification$ = new Subject();
    constructor() { }
    addNotification(message, code) {
        this.newNotification$.next({ message, code });
    }
    addErrorNotification(message) {
        this.errorNotification$.next({ message });
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

var ENotificationCode;
(function (ENotificationCode) {
    ENotificationCode[ENotificationCode["none"] = 0] = "none";
    ENotificationCode[ENotificationCode["error"] = 1] = "error";
    ENotificationCode[ENotificationCode["warning"] = 2] = "warning";
    ENotificationCode[ENotificationCode["information"] = 3] = "information";
    ENotificationCode[ENotificationCode["success"] = 4] = "success";
})(ENotificationCode || (ENotificationCode = {}));

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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ErrorDialog, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<div class=\"container\">\r\n  <byd-title>{{ 'core.notification.error.title' | translate }}</byd-title>\r\n  <p>\r\n    {{ this.data?.message }}\r\n  </p>\r\n  <div class=\"row mB-10\">\r\n    <byd-button class=\"col\" (action)=\"this.copyContent()\">\r\n      {{ 'core.notification.error.copy' | translate }}\r\n    </byd-button>\r\n    <byd-button class=\"col\" (action)=\"this.close()\">\r\n      {{ 'core.notification.error.close' | translate }}\r\n    </byd-button>\r\n  </div>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ErrorDialog, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [BydTitleComponent, BydButtonComponent, TranslatePipe], template: "<div class=\"container\">\r\n  <byd-title>{{ 'core.notification.error.title' | translate }}</byd-title>\r\n  <p>\r\n    {{ this.data?.message }}\r\n  </p>\r\n  <div class=\"row mB-10\">\r\n    <byd-button class=\"col\" (action)=\"this.copyContent()\">\r\n      {{ 'core.notification.error.copy' | translate }}\r\n    </byd-button>\r\n    <byd-button class=\"col\" (action)=\"this.close()\">\r\n      {{ 'core.notification.error.close' | translate }}\r\n    </byd-button>\r\n  </div>\r\n</div>\r\n" }]
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
            this._dialog.open(ErrorDialog, { data: { message: notification.message } });
        }))
            .subscribe());
    }
    getCode(code) {
        return code;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: NotificationBoxComponent, isStandalone: true, selector: "byd-notification-box", usesInheritance: true, ngImport: i0, template: "<div class=\"notification-box_container flex-column g-space-sm\">\r\n  <div *ngFor=\"let item of this.list\">\r\n    <byd-toast [code]=\"this.getCode(item.code)\">\r\n      <byd-notification-inline\r\n        [message]=\"item.message\"\r\n        [code]=\"item.code\"\r\n        [showClose]=\"false\"\r\n      ></byd-notification-inline>\r\n    </byd-toast>\r\n  </div>\r\n</div>\r\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"], dependencies: [{ kind: "component", type: NotificationInlineComponent, selector: "byd-notification-inline", inputs: ["message", "code", "showClose"], outputs: ["askClose"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: ToastComponent, selector: "byd-toast", inputs: ["code"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-notification-box', standalone: true, imports: [NotificationInlineComponent, NgFor, ToastComponent], template: "<div class=\"notification-box_container flex-column g-space-sm\">\r\n  <div *ngFor=\"let item of this.list\">\r\n    <byd-toast [code]=\"this.getCode(item.code)\">\r\n      <byd-notification-inline\r\n        [message]=\"item.message\"\r\n        [code]=\"item.code\"\r\n        [showClose]=\"false\"\r\n      ></byd-notification-inline>\r\n    </byd-toast>\r\n  </div>\r\n</div>\r\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"] }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });

/*
 * Public API Surface of notification
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydNotificationService, ENotificationCode, NotificationBoxComponent, NotificationInlineComponent };
//# sourceMappingURL=beyond-notification.mjs.map
