import * as i0 from '@angular/core';
import { EventEmitter, Output, Input, Component, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BydBaseComponent, TranslatePipe } from '@beyond/utils';
import { NgSwitch, NgSwitchCase, NgClass, NgIf, NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ToastComponent } from '@beyond/ui';
import { Subject } from 'rxjs';

var ENotificationCode;
(function (ENotificationCode) {
    ENotificationCode[ENotificationCode["none"] = 0] = "none";
    ENotificationCode[ENotificationCode["error"] = 1] = "error";
    ENotificationCode[ENotificationCode["warning"] = 2] = "warning";
    ENotificationCode[ENotificationCode["information"] = 3] = "information";
    ENotificationCode[ENotificationCode["success"] = 4] = "success";
})(ENotificationCode || (ENotificationCode = {}));

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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: NotificationInlineComponent, isStandalone: true, selector: "byd-notification-inline", inputs: { message: "message", code: "code", showClose: "showClose" }, outputs: { askClose: "askClose" }, usesInheritance: true, ngImport: i0, template: "<ng-container *ngIf=\"this.showMessage\">\n  <div class=\"notification-container\">\n    <div class=\"text\">\n      <div class=\"label\" [ngClass]=\"this.getTypeClass()\">\n        <mat-icon class=\"mr-space-xs\">{{ this.getIcon() }}</mat-icon>\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"!this.message\">\n          <ng-container *ngSwitchCase=\"this.isError\">\n            {{ \"notification.inline.label.error\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isWarning\">\n            {{ \"notification.inline.label.warning\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isInformation\">\n            {{ \"notification.inline.label.info\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isSuccess\">\n            {{ \"notification.inline.label.success\" | translate }}\n          </ng-container>\n        </ng-container>\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"this.message\">\n          {{ this.message | translate }}\n        </ng-container>\n      </div>\n    </div>\n    <span class=\"close\" (click)=\"this.close()\" *ngIf=\"this.showClose\">\n      <mat-icon>close</mat-icon>\n    </span>\n  </div>\n</ng-container>\n\n<ng-container *ngIf=\"!this.showMessage\">\n  <ng-content></ng-content>\n</ng-container>\n", styles: [".notification-container{position:relative;font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.wrapper{padding:var(--byd-space-sm)}.icon{display:flex;align-items:center}.text .label{display:flex;flex-wrap:wrap;justify-content:flex-start}.text .label.success{color:var(--byd-semantic-token-success)}.text .label.danger{color:var(--byd-semantic-token-alert)}.text .label.warning{color:var(--byd-semantic-token-warning)}.text .label.info{color:var(--byd-semantic-token-link)}.close{position:absolute;top:0;right:0;width:auto;padding:5px;cursor:pointer}\n"], dependencies: [{ kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "directive", type: NgSwitch, selector: "[ngSwitch]", inputs: ["ngSwitch"] }, { kind: "directive", type: NgSwitchCase, selector: "[ngSwitchCase]", inputs: ["ngSwitchCase"] }, { kind: "directive", type: NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationInlineComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-notification-inline', standalone: true, imports: [TranslatePipe, NgSwitch, NgSwitchCase, NgClass, NgIf, MatIcon], template: "<ng-container *ngIf=\"this.showMessage\">\n  <div class=\"notification-container\">\n    <div class=\"text\">\n      <div class=\"label\" [ngClass]=\"this.getTypeClass()\">\n        <mat-icon class=\"mr-space-xs\">{{ this.getIcon() }}</mat-icon>\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"!this.message\">\n          <ng-container *ngSwitchCase=\"this.isError\">\n            {{ \"notification.inline.label.error\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isWarning\">\n            {{ \"notification.inline.label.warning\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isInformation\">\n            {{ \"notification.inline.label.info\" | translate }}\n          </ng-container>\n          <ng-container *ngSwitchCase=\"this.isSuccess\">\n            {{ \"notification.inline.label.success\" | translate }}\n          </ng-container>\n        </ng-container>\n        <ng-container [ngSwitch]=\"true\" *ngIf=\"this.message\">\n          {{ this.message | translate }}\n        </ng-container>\n      </div>\n    </div>\n    <span class=\"close\" (click)=\"this.close()\" *ngIf=\"this.showClose\">\n      <mat-icon>close</mat-icon>\n    </span>\n  </div>\n</ng-container>\n\n<ng-container *ngIf=\"!this.showMessage\">\n  <ng-content></ng-content>\n</ng-container>\n", styles: [".notification-container{position:relative;font-size:var(--byd-font-body-md-default-size);line-height:var(--byd-font-body-md-default-line);font-weight:var(--byd-font-body-md-default-weight)}.wrapper{padding:var(--byd-space-sm)}.icon{display:flex;align-items:center}.text .label{display:flex;flex-wrap:wrap;justify-content:flex-start}.text .label.success{color:var(--byd-semantic-token-success)}.text .label.danger{color:var(--byd-semantic-token-alert)}.text .label.warning{color:var(--byd-semantic-token-warning)}.text .label.info{color:var(--byd-semantic-token-link)}.close{position:absolute;top:0;right:0;width:auto;padding:5px;cursor:pointer}\n"] }]
        }], ctorParameters: () => [], propDecorators: { message: [{
                type: Input
            }], code: [{
                type: Input
            }], showClose: [{
                type: Input
            }], askClose: [{
                type: Output
            }] } });

// export const LAZY_SERVICE_TOKEN = new InjectionToken<TaNotificationService>('TaNotificationService');
class BydNotificationService {
    id = Math.random();
    newNotification$ = new Subject();
    constructor() { }
    addNotification(message, code) {
        this.newNotification$.next({ message, code });
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

class NotificationBoxComponent extends BydBaseComponent {
    _notificationService;
    list = [];
    constructor(_notificationService) {
        super();
        this._notificationService = _notificationService;
        this._registerSubscription(this._notificationService.newNotification$
            .pipe(tap(notification => {
            this.list.push(notification);
        }), tap(notification => {
            setTimeout(() => {
                this.list = this.list.filter(item => item !== notification);
            }, 3000);
        }))
            .subscribe());
    }
    getCode(code) {
        return code;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, deps: [{ token: BydNotificationService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: NotificationBoxComponent, isStandalone: true, selector: "byd-notification-box", usesInheritance: true, ngImport: i0, template: "<div class=\"notification-box_container flex-column g-space-sm\">\n  <div *ngFor=\"let item of this.list\">\n    <byd-toast [code]=\"this.getCode(item.code)\">\n      <byd-notification-inline\n        [message]=\"item.message\"\n        [code]=\"item.code\"\n        [showClose]=\"false\"\n      ></byd-notification-inline>\n    </byd-toast>\n  </div>\n</div>\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"], dependencies: [{ kind: "component", type: NotificationInlineComponent, selector: "byd-notification-inline", inputs: ["message", "code", "showClose"], outputs: ["askClose"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "component", type: ToastComponent, selector: "byd-toast", inputs: ["code"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: NotificationBoxComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-notification-box', standalone: true, imports: [NotificationInlineComponent, NgFor, ToastComponent], template: "<div class=\"notification-box_container flex-column g-space-sm\">\n  <div *ngFor=\"let item of this.list\">\n    <byd-toast [code]=\"this.getCode(item.code)\">\n      <byd-notification-inline\n        [message]=\"item.message\"\n        [code]=\"item.code\"\n        [showClose]=\"false\"\n      ></byd-notification-inline>\n    </byd-toast>\n  </div>\n</div>\n", styles: [".notification-box_container{position:fixed;bottom:24px;min-width:200px;max-width:500px;right:5%;z-index:5000}\n"] }]
        }], ctorParameters: () => [{ type: BydNotificationService }] });

/*
 * Public API Surface of notification
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydNotificationService, ENotificationCode, NotificationBoxComponent, NotificationInlineComponent };
//# sourceMappingURL=beyond-notification.mjs.map
