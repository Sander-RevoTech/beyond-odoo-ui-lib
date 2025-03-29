import * as i0 from '@angular/core';
import { EventEmitter, Output, Input, Component, InjectionToken, inject, Injectable } from '@angular/core';
import { takeImage, picImages, getFirstString, getBase64FromFile, BydBaseComponent } from '@beyond/utils';
import { InputTextBox } from '@beyond/form-model';
import { BydButtonComponent, LoaderComponent, ErrorComponent } from '@beyond/ui';
import { TextBoxComponent } from '@beyond/form-input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@beyond/translation';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { tap, map, Subject, BehaviorSubject, filter } from 'rxjs';
import { BydNotificationService } from '@beyond/notification';
import { BydPermissionsServices } from '@beyond/server';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

class BydUploadComponent {
    features = [];
    canSelectMultipleFiles = false;
    filesPicked = new EventEmitter();
    get addActions() {
        const actionsAvailable = [];
        if (this._haveFeature('take-pic')) {
            actionsAvailable.push({
                label: 'add picture',
                icon: 'add_a_photo',
                callback: () => this._takePic(),
            });
        }
        if (this._haveFeature('upload-pic')) {
            actionsAvailable.push({
                label: 'Upload',
                icon: 'insert_photo',
                callback: () => this._uploadPic(),
            });
        }
        // if (this._haveFeature('upload-file')) {
        //   actionsAvailable.push({
        //     label: 'upload file',
        //     icon: 'upload_file',
        //     callback: () => this._uploadFile(),
        //   });
        // }
        return actionsAvailable;
    }
    _haveFeature(feature) {
        return this.features.includes(feature);
    }
    async _takePic() {
        const file = await takeImage();
        if (!file) {
            return;
        }
        this.filesPicked.emit([file]);
    }
    async _uploadPic() {
        const pics = await picImages();
        this.filesPicked.emit(pics);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUploadComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydUploadComponent, isStandalone: true, selector: "byd-files-upload", inputs: { features: "features", canSelectMultipleFiles: "canSelectMultipleFiles" }, outputs: { filesPicked: "filesPicked" }, ngImport: i0, template: "@if (this.addActions.length === 1) {\r\n  <byd-button (action)=\"this.addActions[0].callback()\">\r\n    <mat-icon>{{ this.addActions[0].icon | translate }}</mat-icon>\r\n  </byd-button>\r\n} @else if (this.addActions.length > 1) {\r\n  <byd-button *ngFor=\"let action of this.addActions\" (action)=\"action.callback()\">\r\n    <mat-icon>{{ action.icon }}</mat-icon>\r\n  </byd-button>\r\n}\r\n", styles: [""], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-files-upload', standalone: true, imports: [BydButtonComponent, MatIcon, TranslatePipe], template: "@if (this.addActions.length === 1) {\r\n  <byd-button (action)=\"this.addActions[0].callback()\">\r\n    <mat-icon>{{ this.addActions[0].icon | translate }}</mat-icon>\r\n  </byd-button>\r\n} @else if (this.addActions.length > 1) {\r\n  <byd-button *ngFor=\"let action of this.addActions\" (action)=\"action.callback()\">\r\n    <mat-icon>{{ action.icon }}</mat-icon>\r\n  </byd-button>\r\n}\r\n" }]
        }], propDecorators: { features: [{
                type: Input
            }], canSelectMultipleFiles: [{
                type: Input
            }], filesPicked: [{
                type: Output
            }] } });

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class OdooJsonConnector {
    notificationService = inject(BydNotificationService);
    permissionsServices = inject(BydPermissionsServices);
    server = inject(ODOO_SERVER_CONFIG_KEY);
    get uid() {
        return this.permissionsServices.uid;
    }
    get pass() {
        return this.permissionsServices.pass;
    }
    get url() {
        return this.server.proxyUrl;
    }
    get db() {
        return this.server.db;
    }
    constructor() { }
    login$(user, password) {
        console.info('Getting UID');
        return this._connectWithCredentials$(user, password).pipe(tap(result => {
            this.permissionsServices.set(result.uid, password);
        }), map(result => result.uid));
    }
    // Connexion avec identifiants
    _connectWithCredentials$(user, password) {
        const endpoint = `${this.url}/web/session/authenticate`;
        const params = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                db: this.db,
                login: user,
                password: password,
            },
            id: new Date().getTime(),
        };
        return this._call$(endpoint, params);
    }
    searchCount$(model, domain, opts = {}) {
        console.info('Search & Count:', model);
        return this._call_kw$(model, 'search_count', [domain], opts);
    }
    searchRead$(model, domain, fields = [], opts = {}) {
        console.info('Search & Read:', model);
        return this._call_kw$(model, 'search_read', [domain, fields], opts);
    }
    create$(model, values) {
        return this._call_kw$(model, 'create', [values]);
    }
    write$(model, id, values) {
        return this._call_kw$(model, 'write', [[id], values]);
    }
    delete$(model, id) {
        return this._call_kw$(model, 'unlink', [[id]]);
    }
    action$(model, action, ids) {
        return this._call_kw$(model, action, ids);
    }
    _call_kw$(model, method, args, kwargs = {}) {
        return this._callWithUid(model, method, args, kwargs);
    }
    _callWithUid(model, method, args, kwargs = {}) {
        const endpoint = `${this.url}/jsonrpc`;
        const params = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'object',
                method: 'execute_kw',
                args: [this.db, this.uid, this.pass, model, method, args, kwargs],
            },
            id: new Date().getTime(),
        };
        return this._call$(endpoint, params);
    }
    _call$(endpoint, params) {
        const subject$ = new Subject();
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        }).then(response => {
            this._extractResult(response)
                .then(result => {
                console.log('response, ', result);
                subject$.next(result);
                subject$.complete();
                subject$.unsubscribe();
            })
                .catch(error => {
                subject$.error(error);
                subject$.complete();
                subject$.unsubscribe();
                this._handleErrorMessage(error);
            });
        });
        return subject$;
    }
    async _extractResult(response) {
        if (!response || !response.ok) {
            throw new Error(response?.statusText || 'Connection Error');
        }
        const body = await response.json();
        if (body.error) {
            this._handleErrorMessage(body.error.data.message);
            throw new Error(body.error.data.message);
        }
        return body.result;
    }
    _handleErrorMessage(message) {
        const formattedMessage = message
            .toString()
            .replace('Error: Invalid XML-RPC', '')
            .replace('Error: XML-RPC fault:', '');
        this.notificationService.addErrorNotification(formattedMessage);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: OdooJsonConnector, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydBaseOdooService {
    _odooService = inject(OdooJsonConnector);
    constructor() { }
    _handleJoinData(entity, props) {
        return props.reduce((entityFilled, prop) => {
            const linkProp = prop.from ? prop.from : prop.to.toString() + '_id';
            const list = entity[linkProp] || [];
            entityFilled[prop.to] = getFirstString(list);
            return entityFilled;
        }, entity);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydBaseOdooService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class AppMessagesService extends BydBaseOdooService {
    messages$ = new BehaviorSubject({});
    constructor() {
        super();
    }
    getMessages$(id) {
        return this.messages$.pipe(map(data => data[id]));
    }
    fetchMessage$(data) {
        return this._odooService
            .searchRead$('mail.message', [
            ['res_id', '=', data.res_id],
            ['model', 'like', data.model],
            ['message_type', 'like', data.message_type],
        ], ['body', 'attachment_ids'])
            .pipe(filter(data => !!data), tap(list => {
            const entities = this.messages$.getValue();
            entities[data.res_id] = list;
            this.messages$.next(entities);
        }));
    }
    async postMessage$(id, message, files) {
        const attachments = [];
        for (let file of files.filter(att => att.file)) {
            const base64 = file.file ? await getBase64FromFile(file.file) : null;
            attachments.push({ file: base64, filetype: 'jpeg' });
        }
        return this._odooService.create$('mail.message', { ...message, ...{ subtype_id: 2 } }).pipe(filter(data => !!data));
        // return this._odooService
        //   .action$<Message>('sale.order', 'log_message', [id],
        //   //    {
        //   //   ...message,
        //   //   ...(attachments.length > 0 ? { attachments } : {}),
        //   // }
        // )
        //   .pipe(filter(data => !!data));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppMessagesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppMessagesService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: AppMessagesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydMessagesComponent extends BydBaseComponent {
    _messagesService;
    id;
    model;
    input = new InputTextBox();
    tempImages = [];
    get disable() {
        return !this.input.value && this.tempImages.length === 0;
    }
    get data$() {
        return this._messagesService.getMessages$(this.id);
    }
    constructor(_messagesService) {
        super();
        this._messagesService = _messagesService;
        this.input.createFormControl();
    }
    ngOnInit() {
        this._fetch();
    }
    uploadImage(images) {
        this.tempImages = [...this.tempImages, ...images];
    }
    remove(pic) {
        this.tempImages = this.tempImages.filter(item => item.localUrl !== pic.localUrl);
    }
    getPicUrl(id) {
        return ""; // `${environment.server.odooUrl}/web/image/${id}`;
    }
    async send() {
        this.requestState.asked();
        const subject$ = await this._messagesService.postMessage$(this.id, {
            body: this.input.value ?? '',
            res_id: this.id,
            model: this.model,
            message_type: 'comment',
        }, this.tempImages);
        subject$?.subscribe(() => {
            this._fetch();
            this.tempImages = [];
            this.input.value = '';
        });
    }
    _fetch() {
        this.requestState.asked();
        this._messagesService
            .fetchMessage$({
            res_id: this.id,
            model: this.model,
            message_type: 'comment',
        })
            .subscribe({
            complete: () => this.requestState.completed(),
            error: (error) => {
                this.requestState.onError(error.status, error.statusText);
            },
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesComponent, deps: [{ token: AppMessagesService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydMessagesComponent, isStandalone: true, selector: "byd-messages", inputs: { id: "id", model: "model" }, usesInheritance: true, ngImport: i0, template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div class=\"row row-cols-3 g-0 align-items-center mb-2\">\r\n        <div *ngFor=\"let pic of this.tempImages\" class=\"temp-pic-container\">\r\n          <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n          <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n            <mat-icon>close</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div>\r\n          <byd-files-upload (filesPicked)=\"this.uploadImage($event)\" [features]=\"['take-pic']\"></byd-files-upload>\r\n        </div>\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"row row-cols-3\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}.temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: BydUploadComponent, selector: "byd-files-upload", inputs: ["features", "canSelectMultipleFiles"], outputs: ["filesPicked"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-messages', standalone: true, imports: [BydButtonComponent, LoaderComponent, ErrorComponent, TextBoxComponent, MatIcon, BydUploadComponent, NgIf, NgFor, AsyncPipe], template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div class=\"row row-cols-3 g-0 align-items-center mb-2\">\r\n        <div *ngFor=\"let pic of this.tempImages\" class=\"temp-pic-container\">\r\n          <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n          <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n            <mat-icon>close</mat-icon>\r\n          </div>\r\n        </div>\r\n        <div>\r\n          <byd-files-upload (filesPicked)=\"this.uploadImage($event)\" [features]=\"['take-pic']\"></byd-files-upload>\r\n        </div>\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"row row-cols-3\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}.temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"] }]
        }], ctorParameters: () => [{ type: AppMessagesService }], propDecorators: { id: [{
                type: Input
            }], model: [{
                type: Input
            }] } });

class TargetUrlInterceptor {
    server = inject(ODOO_SERVER_CONFIG_KEY);
    constructor() { }
    intercept(req, next) {
        return next.handle(req.clone({
            headers: req.headers.set('target-url', this.server.odooUrl),
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: TargetUrlInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

const provideOdoo = () => [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TargetUrlInterceptor,
        multi: true,
    },
];

class BydAuthOdooService extends BydBaseOdooService {
    permissionsServices = inject(BydPermissionsServices);
    constructor() {
        super();
    }
    login$(data) {
        return this._odooService.login$(data.identifier, data.password);
    }
    logout() {
        this.permissionsServices.reset();
        location.reload();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAuthOdooService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

/*
 * Public API Surface of odoo
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppMessagesService, BydAuthOdooService, BydBaseOdooService, BydMessagesComponent, BydUploadComponent, ODOO_SERVER_CONFIG_KEY, TargetUrlInterceptor, provideOdoo };
//# sourceMappingURL=beyond-odoo.mjs.map
