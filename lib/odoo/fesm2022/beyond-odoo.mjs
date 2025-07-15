import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, EventEmitter, signal, effect, Output, Input, Component, Inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TextBoxComponent } from '@beyond/form-input';
import { InputTextBox, InputDropdown, InputPanel, InputLabel, InputNumber, InputCheckBox } from '@beyond/form-model';
import { BydButtonComponent, LoaderComponent, ErrorComponent, EmptyComponent, CardComponent, CardHeaderComponent, CardTitleComponent, CardCtaComponent, BydTitleComponent } from '@beyond/ui';
import { getFirstString, getBase64FromFile, BydBaseComponent, takeImage, picImages, isNonNullable, getFirstNumber } from '@beyond/utils';
import { map, catchError, of, tap, Subject, filter, forkJoin, BehaviorSubject, mergeMap } from 'rxjs';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydPermissionsServices, HandleComplexRequest, HandleSimpleRequest } from '@beyond/server';
import { TranslatePipe } from '@beyond/translation';
import * as i1$1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import * as i1 from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { filter as filter$1, map as map$1, mergeMap as mergeMap$1, switchMap } from 'rxjs/operators';
import { BydFormComponent } from '@beyond/form-basic';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const ODOO_SERVER_CONFIG_KEY = new InjectionToken('odoo-server-config');

class OdooJsonConnector {
    notificationService = inject(BydNotificationService);
    permissionsServices = inject(BydPermissionsServices);
    server = inject(ODOO_SERVER_CONFIG_KEY);
    get uid() {
        return this.permissionsServices.hasRole('shared') ? '%%COMMON_ID%%' : this.permissionsServices.uid;
    }
    get pass() {
        return this.permissionsServices.hasRole('shared') ? '%%COMMON_PASS%%' : this.permissionsServices.pass;
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
        if (!user) {
            this.permissionsServices.set(2, password);
            return this.searchCount$('res.users', [['id', '=', 2]]).pipe(map(() => 2), catchError(err => {
                this.permissionsServices.reset();
                return of(err.message);
            }));
        }
        return this._connectWithCredentials$(user, password).pipe(tap(result => {
            this.permissionsServices.set(result.uid, password);
        }), map(result => result.uid));
    }
    getSessionInfo$() {
        const endpoint = `${this.url}/web/session/get_session_info`;
        const params = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                db: this.db,
                uid: this.permissionsServices.uid,
                password: this.permissionsServices.pass,
            },
            id: new Date().getTime(),
        };
        return this._call$(endpoint, params);
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
    searchReadAndGroup$(model, domain, fields = [], groups = [], opts = {}) {
        console.info('Search & Read - Group:', model);
        return this._call_kw$(model, 'read_group', [domain, fields, groups], opts);
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
    action$(model, action, id, context) {
        return this._call_kw$(model, action, [[id]], context);
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
                args: [
                    this.db,
                    this.uid,
                    this.pass,
                    model,
                    method,
                    args,
                    {
                        ...kwargs,
                        ...{
                            context: { company_id: this.permissionsServices.company, employee_id: this.permissionsServices.employee },
                        },
                    },
                ],
            },
            id: new Date().getTime(),
        };
        return this._call$(endpoint, params);
    }
    _call$(endpoint, params) {
        const subject$ = new Subject();
        this.notificationService.incPendingBlockedRequest();
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'target-url': this.server.odooUrl,
            },
            body: JSON.stringify(params),
        }).then(response => {
            this._extractResult(response)
                .then(result => {
                console.log('response, ', result);
                this.notificationService.decPendingBlockedRequest();
                subject$.next(result);
                subject$.complete();
                subject$.unsubscribe();
            })
                .catch(error => {
                this.notificationService.decPendingBlockedRequest();
                subject$.error(error);
                subject$.complete();
                subject$.unsubscribe();
                //this._handleErrorMessage(error);
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
            this._handleErrorMessage(body.error.data);
            throw new Error(body.error.data.message);
        }
        return body.result;
    }
    _handleErrorMessage(data) {
        const formattedMessage = data.message
            .toString()
            .replace('Error: Invalid XML-RPC', '')
            .replace('Error: XML-RPC fault:', '');
        switch (data.name) {
            case 'odoo.exceptions.ValidationError':
            case 'odoo.exceptions.UserError':
                this.notificationService.addUserNotification(formattedMessage);
                break;
            default:
                this.notificationService.addErrorNotification(formattedMessage);
        }
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

class BydAttachementsService extends BydBaseOdooService {
    attachments = new HandleComplexRequest();
    constructor() {
        super();
    }
    key(id, model) {
        return `${id}-${model}`;
    }
    fetch$(id, model) {
        return this.attachments.fetch(this.key(id, model), this._odooService
            .searchRead$('ir.attachment', [
            ['res_id', '=', id],
            ['res_model', '=', model],
        ], ['id', 'datas'])
            .pipe(filter(data => !!data)));
    }
    async post$(id, model, files) {
        const attachments = [];
        for (let file of files.filter(att => att.file)) {
            if (!file.file) {
                continue;
            }
            const base64 = (await getBase64FromFile(file.file)).split(',')[1];
            attachments.push({ name: 'attachments-by-app-' + id, datas: base64, res_model: model });
        }
        return attachments.length > 0
            ? forkJoin([
                ...attachments.map(attachment => this._odooService.create$('ir.attachment', { ...attachment, ...{ res_id: id } })),
            ])
            : of([]);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAttachementsService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAttachementsService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydAttachementsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydMessagesService extends BydBaseOdooService {
    messages$ = new BehaviorSubject({});
    _attachmentsService = inject(BydAttachementsService);
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
            if (!file.file) {
                continue;
            }
            const base64 = (await getBase64FromFile(file.file)).split(',')[1];
            attachments.push({ name: 'attachments-by-app-' + id, datas: base64, res_model: message.model });
        }
        return (files.length > 0 ? await this._attachmentsService.post$(id, message.model, files) : of([])).pipe(mergeMap((ids) => {
            return this._odooService.create$('mail.message', {
                ...message,
                ...{ subtype_id: 2, attachment_ids: ids },
            });
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydUploadComponent extends BydBaseComponent {
    features = [];
    canSelectMultipleFiles = false;
    clear$ = null;
    filesPicked = new EventEmitter();
    tempImages = signal([]);
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
    constructor() {
        super();
        effect(() => {
            this.filesPicked.emit(this.tempImages());
        });
    }
    ngOnInit() {
        if (this.clear$) {
            this._registerSubscription(this.clear$.subscribe(() => {
                this.tempImages.set([]);
            }));
        }
    }
    addImage(images) {
        this.tempImages.set([...this.tempImages(), ...images]);
    }
    remove(pic) {
        this.tempImages.set(this.tempImages().filter(item => item.localUrl !== pic.localUrl));
    }
    _haveFeature(feature) {
        return this.features.includes(feature);
    }
    async _takePic() {
        const file = await takeImage();
        if (!file) {
            return;
        }
        this.addImage([file]);
    }
    async _uploadPic() {
        const pics = await picImages();
        this.addImage(pics);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUploadComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: BydUploadComponent, isStandalone: true, selector: "byd-files-upload", inputs: { features: "features", canSelectMultipleFiles: "canSelectMultipleFiles", clear$: "clear$" }, outputs: { filesPicked: "filesPicked" }, usesInheritance: true, ngImport: i0, template: "<div class=\"mb-space-md\">\r\n  <div class=\"grid align-items-center mb-space-xs\">\r\n    @for (pic of this.tempImages(); track pic.localUrl) {\r\n      <div class=\"temp-pic-container g-col-3\">\r\n        <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n        <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n          <mat-icon>close</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n  </div>\r\n  <div>\r\n    @if (this.addActions.length === 1) {\r\n      <byd-button (action)=\"this.addActions[0].callback()\">\r\n        <mat-icon>{{ this.addActions[0].icon | translate }}</mat-icon>\r\n      </byd-button>\r\n    } @else if (this.addActions.length > 1) {\r\n      <div class=\"flex-start g-space-lg\">\r\n        @for (action of this.addActions; track action.label) {\r\n          <byd-button (action)=\"action.callback()\">\r\n            <mat-icon>{{ action.icon }}</mat-icon>\r\n          </byd-button>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n</div>\r\n", styles: [".temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: TranslatePipe, name: "translate" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydUploadComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-files-upload', standalone: true, imports: [BydButtonComponent, MatIcon, TranslatePipe], template: "<div class=\"mb-space-md\">\r\n  <div class=\"grid align-items-center mb-space-xs\">\r\n    @for (pic of this.tempImages(); track pic.localUrl) {\r\n      <div class=\"temp-pic-container g-col-3\">\r\n        <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n        <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n          <mat-icon>close</mat-icon>\r\n        </div>\r\n      </div>\r\n    }\r\n  </div>\r\n  <div>\r\n    @if (this.addActions.length === 1) {\r\n      <byd-button (action)=\"this.addActions[0].callback()\">\r\n        <mat-icon>{{ this.addActions[0].icon | translate }}</mat-icon>\r\n      </byd-button>\r\n    } @else if (this.addActions.length > 1) {\r\n      <div class=\"flex-start g-space-lg\">\r\n        @for (action of this.addActions; track action.label) {\r\n          <byd-button (action)=\"action.callback()\">\r\n            <mat-icon>{{ action.icon }}</mat-icon>\r\n          </byd-button>\r\n        }\r\n      </div>\r\n    }\r\n  </div>\r\n</div>\r\n", styles: [".temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { features: [{
                type: Input
            }], canSelectMultipleFiles: [{
                type: Input
            }], clear$: [{
                type: Input
            }], filesPicked: [{
                type: Output
            }] } });

class BydMessagesComponent extends BydBaseComponent {
    id;
    model;
    server = inject(ODOO_SERVER_CONFIG_KEY);
    clearImage$ = new Subject();
    _messagesService = inject(BydMessagesService);
    input = new InputTextBox();
    images = signal([]);
    get disable() {
        return !this.input.value && this.images().length === 0;
    }
    get data$() {
        return this._messagesService.getMessages$(this.id);
    }
    constructor() {
        super();
        this.input.createFormControl();
    }
    ngOnInit() {
        this._fetch();
    }
    getPicUrl(id) {
        return `${this.server.odooUrl}/web/image/${id}`;
    }
    async send() {
        this.requestState.asked();
        const subject$ = await this._messagesService.postMessage$(this.id, {
            body: this.input.value ?? '',
            res_id: this.id,
            model: this.model,
            message_type: 'comment',
        }, this.images());
        subject$?.subscribe(() => {
            this._fetch();
            this.images.set([]);
            this.input.value = '';
            this.clearImage$.next(null);
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydMessagesComponent, isStandalone: true, selector: "byd-messages", inputs: { id: "id", model: "model" }, usesInheritance: true, ngImport: i0, template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div>\r\n        <byd-files-upload\r\n          (filesPicked)=\"this.images.set($event)\"\r\n          [features]=\"['take-pic', 'upload-pic']\"\r\n          [clear$]=\"this.clearImage$\"\r\n        ></byd-files-upload>\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"grid\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\" class=\"g-col-3\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}\n"], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: BydUploadComponent, selector: "byd-files-upload", inputs: ["features", "canSelectMultipleFiles", "clear$"], outputs: ["filesPicked"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-messages', standalone: true, imports: [
                        BydButtonComponent,
                        LoaderComponent,
                        ErrorComponent,
                        TextBoxComponent,
                        MatIcon,
                        BydUploadComponent,
                        NgIf,
                        NgFor,
                        AsyncPipe,
                    ], template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div>\r\n        <byd-files-upload\r\n          (filesPicked)=\"this.images.set($event)\"\r\n          [features]=\"['take-pic', 'upload-pic']\"\r\n          [clear$]=\"this.clearImage$\"\r\n        ></byd-files-upload>\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"grid\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\" class=\"g-col-3\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}\n"] }]
        }], ctorParameters: () => [], propDecorators: { id: [{
                type: Input
            }], model: [{
                type: Input
            }] } });

class BydScanPackingService extends BydBaseOdooService {
    askScanning = new Subject();
    searchScanItem = null;
    constructor() {
        super();
    }
    lookForPacking$(model, id) {
        return this._odooService.action$(model, 'search_by_id', id).pipe(filter(data => !!data));
    }
    setActiveScanItem(item) {
        this.searchScanItem = item;
    }
    clearActiveScanItem() {
        this.searchScanItem = null;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydScanningComponent extends BydBaseComponent {
    scanSuccess = new EventEmitter();
    error = new EventEmitter();
    close = new EventEmitter();
    _notificationService = inject(BydNotificationService);
    scanError(error) {
        //console.error('scanError: ', error);
    }
    permissionResponse(repsonse) {
        if (!repsonse) {
            this._notificationService.addErrorNotification('Permission not granted');
            this.error.emit();
            return;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanningComponent, deps: null, target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydScanningComponent, isStandalone: true, selector: "byd-scanning", outputs: { scanSuccess: "scanSuccess", error: "error", close: "close" }, usesInheritance: true, ngImport: i0, template: "<div class=\"flex-column g-space-md\">\r\n  <zxing-scanner\r\n    [tryHarder]=\"true\"\r\n    (scanSuccess)=\"this.scanSuccess.emit($event)\"\r\n    (scanFailure)=\"this.scanError($event)\"\r\n    (scanError)=\"this.scanError($event)\"\r\n    (permissionResponse)=\"this.permissionResponse($event)\"\r\n  ></zxing-scanner>\r\n  <byd-button (action)=\"this.close.emit()\">Close scanner</byd-button>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "ngmodule", type: ZXingScannerModule }, { kind: "component", type: i1.ZXingScannerComponent, selector: "zxing-scanner", inputs: ["autofocusEnabled", "timeBetweenScans", "delayBetweenScanSuccess", "autostart", "previewFitMode", "poster", "device", "formats", "videoConstraints", "torch", "enable", "tryHarder"], outputs: ["autostarted", "autostarting", "torchCompatible", "scanSuccess", "scanFailure", "scanError", "scanComplete", "camerasFound", "camerasNotFound", "permissionResponse", "hasDevices", "deviceChange"] }, { kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanningComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-scanning', imports: [ZXingScannerModule, BydButtonComponent], template: "<div class=\"flex-column g-space-md\">\r\n  <zxing-scanner\r\n    [tryHarder]=\"true\"\r\n    (scanSuccess)=\"this.scanSuccess.emit($event)\"\r\n    (scanFailure)=\"this.scanError($event)\"\r\n    (scanError)=\"this.scanError($event)\"\r\n    (permissionResponse)=\"this.permissionResponse($event)\"\r\n  ></zxing-scanner>\r\n  <byd-button (action)=\"this.close.emit()\">Close scanner</byd-button>\r\n</div>\r\n" }]
        }], propDecorators: { scanSuccess: [{
                type: Output
            }], error: [{
                type: Output
            }], close: [{
                type: Output
            }] } });

class ScanPackingDialog extends BydBaseComponent {
    dialogRef;
    data;
    _scanPackingService = inject(BydScanPackingService);
    _notificationService = inject(BydNotificationService);
    step = signal('scan');
    activeScope = null;
    searchResult = null;
    get scopes() {
        return this.data?.scopes || [];
    }
    get noData() {
        if (!this.searchResult) {
            return true;
        }
        return Object.values(this.searchResult).every(items => items.length === 0);
    }
    constructor(dialogRef, data) {
        super();
        this.dialogRef = dialogRef;
        this.data = data;
    }
    scanSuccess(result) {
        if (!result) {
            this._notificationService.addErrorNotification('QR core is not valid');
            this.dialogRef.close();
            return;
        }
        const id = this._extractIdFormUrl(result);
        if (!id || isNaN(id)) {
            this._notificationService.addErrorNotification('QR core is not valid (id)');
            this.dialogRef.close();
            return;
        }
        const model = this._extractModelFormUrl(result);
        if (!model) {
            this._notificationService.addErrorNotification('QR core is not valid (model)');
            this.dialogRef.close();
            return;
        }
        this.step.set('search');
        this._scanPackingService.lookForPacking$(model, id).subscribe({
            next: searchResult => {
                this._processSearchResult(searchResult);
                this.requestState.completed();
            },
            error: () => {
                this.dialogRef.close();
            },
        });
    }
    getDataByScope(scope) {
        if (!this.searchResult) {
            return [];
        }
        return this.searchResult[scope.key] || [];
    }
    setScope(scope) {
        this.activeScope = scope;
        const list = this.getDataByScope(scope);
        if (list.length === 1) {
            this.navigateTo(scope, list[0]);
        }
    }
    navigateTo(scope, item) {
        if (!scope) {
            return;
        }
        this._scanPackingService.setActiveScanItem(item);
        scope.navigation(item);
        this.dialogRef.close();
    }
    _processSearchResult(searchResult) {
        this.searchResult = searchResult;
        const allEntries = Object.entries(searchResult);
        const totalCount = allEntries.reduce((sum, [, items]) => sum + items.length, 0);
        if (totalCount !== 1) {
            return;
        }
        for (const [key, items] of allEntries) {
            if (items.length > 0) {
                const scope = this._getScopeByKey(key);
                this.navigateTo(scope, items[0]);
                return;
            }
        }
    }
    _getScopeByKey(key) {
        return this.scopes.find(scope => scope.key === key) || null;
    }
    _extractIdFormUrl(url) {
        const match = url.match(/id=(\d+)/);
        if (!match) {
            return null;
        }
        return Number(match[1]);
    }
    _extractModelFormUrl(url) {
        const match = url.match(/model=([a-zA-Z.]+)/);
        if (!match) {
            return null;
        }
        return match[1];
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ScanPackingDialog, deps: [{ token: i1$1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: ScanPackingDialog, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<div class=\"p-space-md\">\r\n  @if (this.step() === 'scan') {\r\n    <byd-scanning (scanSuccess)=\"this.scanSuccess($event)\" (error)=\"this.dialogRef.close()\"></byd-scanning>\r\n  } @else if (this.step() === 'search') {\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        <byd-empty [isEmpty]=\"this.noData\" [isLight]=\"false\">\r\n          <div class=\"grid\">\r\n            @for (scope of this.scopes; track scope) {\r\n              @if (this.getDataByScope(scope).length > 0) {\r\n                <div>\r\n                  <byd-card [highlight]=\"this.activeScope?.key === scope.key\" (click)=\"this.setScope(scope)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ 'scan.' + scope.key + '.name' | translate }} ({{ this.getDataByScope(scope).length }})\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            }\r\n          </div>\r\n          @if (this.activeScope) {\r\n            <div>\r\n              @for (item of this.getDataByScope(this.activeScope); track item) {\r\n                <div class=\"flex-column justify-content-between m-space-md\">\r\n                  <byd-card (click)=\"this.navigateTo(this.activeScope, item)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ item.name }}\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                    <byd-card-cta>\r\n                      <mat-icon>chevron_right</mat-icon>\r\n                    </byd-card-cta>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            </div>\r\n          }\r\n        </byd-empty>\r\n      </byd-error>\r\n    </byd-loader>\r\n  }\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: EmptyComponent, selector: "byd-empty", inputs: ["isEmpty", "isLight", "showMessage", "text", "type", "icon", "iconSize"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "ngmodule", type: ZXingScannerModule }, { kind: "component", type: CardComponent, selector: "byd-card", inputs: ["highlight", "shadow", "fullHeight", "noContent", "isNew", "type"], outputs: ["click"] }, { kind: "component", type: CardHeaderComponent, selector: "byd-card-header" }, { kind: "component", type: CardTitleComponent, selector: "byd-card-title" }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "component", type: CardCtaComponent, selector: "byd-card-cta" }, { kind: "component", type: BydScanningComponent, selector: "byd-scanning", outputs: ["scanSuccess", "error", "close"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ScanPackingDialog, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [
                        LoaderComponent,
                        EmptyComponent,
                        ErrorComponent,
                        ZXingScannerModule,
                        CardComponent,
                        CardHeaderComponent,
                        CardTitleComponent,
                        TranslatePipe,
                        MatIcon,
                        CardCtaComponent,
                        BydScanningComponent,
                    ], template: "<div class=\"p-space-md\">\r\n  @if (this.step() === 'scan') {\r\n    <byd-scanning (scanSuccess)=\"this.scanSuccess($event)\" (error)=\"this.dialogRef.close()\"></byd-scanning>\r\n  } @else if (this.step() === 'search') {\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        <byd-empty [isEmpty]=\"this.noData\" [isLight]=\"false\">\r\n          <div class=\"grid\">\r\n            @for (scope of this.scopes; track scope) {\r\n              @if (this.getDataByScope(scope).length > 0) {\r\n                <div>\r\n                  <byd-card [highlight]=\"this.activeScope?.key === scope.key\" (click)=\"this.setScope(scope)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ 'scan.' + scope.key + '.name' | translate }} ({{ this.getDataByScope(scope).length }})\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            }\r\n          </div>\r\n          @if (this.activeScope) {\r\n            <div>\r\n              @for (item of this.getDataByScope(this.activeScope); track item) {\r\n                <div class=\"flex-column justify-content-between m-space-md\">\r\n                  <byd-card (click)=\"this.navigateTo(this.activeScope, item)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ item.name }}\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                    <byd-card-cta>\r\n                      <mat-icon>chevron_right</mat-icon>\r\n                    </byd-card-cta>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            </div>\r\n          }\r\n        </byd-empty>\r\n      </byd-error>\r\n    </byd-loader>\r\n  }\r\n</div>\r\n" }]
        }], ctorParameters: () => [{ type: i1$1.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }] });

class BydScanPackingComponent extends BydBaseComponent {
    _dialog;
    scopes;
    _scanPacking = inject(BydScanPackingService);
    constructor(_dialog) {
        super();
        this._dialog = _dialog;
        this._registerSubscription(this._scanPacking.askScanning.subscribe(this.openScan));
    }
    openScan = () => {
        this._dialog.open(ScanPackingDialog, {
            data: {
                scopes: this.scopes,
            },
        });
    };
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingComponent, deps: [{ token: i1$1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydScanPackingComponent, isStandalone: true, selector: "byd-scan-packing", inputs: { scopes: "scopes" }, usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'byd-scan-packing',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1$1.MatDialog }], propDecorators: { scopes: [{
                type: Input
            }] } });

class BydPrinterService extends BydBaseOdooService {
    askPrintingWizard$ = new Subject();
    printers = new HandleSimpleRequest();
    printWizard = new HandleComplexRequest();
    constructor() {
        super();
    }
    printWizard$(data) {
        const model = data.model === 'print.direct.wizard'
            ? this._odooService.searchRead$('print.direct.wizard', [['id', '=', data.id]], ['id', 'display_name', 'print_lines'])
            : of([
                {
                    id: data.id,
                    display_name: '',
                    print_lines: [data.id],
                },
            ]);
        return this.printWizard.fetch(data.id, model.pipe(filter$1(data => !!data), map$1(data => data[0]), mergeMap$1(entity => this._odooService
            .searchRead$('print.direct.wizard.line', [['id', 'in', entity.print_lines]], ['id', 'display_name', 'print_qty', 'printer_id'])
            .pipe(map$1(lines => ({
            ...entity,
            ...{
                lines,
            },
        }))))));
    }
    fetchPrinters$() {
        return this.printers.fetch(this._odooService.searchRead$('remote.printer.printer', [], ['id', 'name']).pipe(filter$1(isNonNullable)));
    }
    print$(lines) {
        return forkJoin(lines.map(line => {
            if (line.print_qty === 0 || !line.printer_id) {
                return of();
            }
            return this._odooService
                .write$('print.direct.wizard.line', line.id, line)
                .pipe(switchMap(() => this._odooService.action$('print.direct.wizard.line', 'action_print', line.id)));
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydPrinterFormService {
    _printerService = inject(BydPrinterService);
    constructor() {
        this._printerService.fetchPrinters$().subscribe();
    }
    getForm(wizard) {
        /* printer */
        const printerItemsInput = [];
        const printerlistInput = new InputDropdown({
            key: 'printer',
            showNothingOption: true,
            class: 'g-col-5',
            options: this._printerService.printers.get$().pipe(map$1(printers => printers?.map(printer => ({
                id: printer.id.toString(),
                name: printer.name,
            })) ?? [])),
        });
        printerlistInput.changeValue$.subscribe(value => {
            printerItemsInput.forEach(item => (item.value = value ? value : null));
        });
        return [
            new InputPanel({
                key: 'panel',
                class: 'g-col-9',
                children: [
                    new InputPanel({
                        key: 'panel',
                        class: 'p-15',
                        contentClass: 'grid align-items-center',
                        children: [
                            new InputLabel({
                                key: 'label',
                                label: 'Printer: ',
                            }),
                            printerlistInput,
                        ],
                    }),
                    new InputPanel({
                        key: 'panel',
                        contentClass: 'grid align-items-center fs-5',
                        children: [
                            new InputLabel({
                                key: 'label',
                                label: 'Label for',
                                class: 'g-col-7 ta-c',
                            }),
                            new InputLabel({
                                key: 'label',
                                label: 'Quantity',
                                class: 'g-col-2 ta-c',
                            }),
                            new InputLabel({
                                key: 'label',
                                label: 'Printer',
                                class: 'g-col-3 ta-c',
                            }),
                        ],
                    }),
                    ...(wizard.lines?.map(line => {
                        /** Print */
                        const printerInput = new InputDropdown({
                            key: 'line-' + line.id + '-printer',
                            class: 'g-col-3',
                            showNothingOption: true,
                            options: this._printerService.printers.get$().pipe(map$1(printers => printers?.map(printer => ({
                                id: printer.id.toString(),
                                name: printer.name,
                            })) ?? [])),
                            value: getFirstNumber(line.printer_id)?.toString(),
                        });
                        printerItemsInput.push(printerInput);
                        /** qty */
                        const qtyInput = new InputNumber({
                            key: 'line-' + line.id + '-qty',
                            class: 'g-col-2',
                            value: line.print_qty.toString(),
                        });
                        return new InputPanel({
                            key: 'panel',
                            contentClass: 'grid align-items-center',
                            children: [
                                new InputCheckBox({
                                    key: 'line-' + line.id + '-check',
                                    class: 'g-col-1',
                                    toggle: true,
                                    value: true,
                                }),
                                new InputLabel({
                                    key: 'label-' + line.id,
                                    label: line.display_name,
                                    class: 'g-col-6 fs-5',
                                    value: line.id,
                                }),
                                qtyInput,
                                printerInput,
                            ],
                        });
                    }) ?? []),
                ],
            }),
        ];
    }
    formatForm(data) {
        const keys = Object.keys(data);
        const lineIds = keys
            .filter(key => key.startsWith('label-'))
            .map(key => data[key])
            .filter(id => data['line-' + id + '-check']);
        return lineIds.map(id => ({
            id: id,
            print_qty: Number(data['line-' + id + '-qty']),
            printer_id: Number(data['line-' + id + '-printer']),
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterFormService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterFormService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPrinterFormService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class LabelModal extends BydBaseComponent {
    dialogRef;
    data;
    _notificationService = inject(BydNotificationService);
    _printerService = inject(BydPrinterService);
    _printerFormService = inject(BydPrinterFormService);
    form = [];
    wizard = signal(of(null));
    constructor(dialogRef, data) {
        super();
        this.dialogRef = dialogRef;
        this.data = data;
        this.wizard.set(this._printerService.printWizard.get$(this.data.id));
        this._fetch();
    }
    print(values) {
        this.requestState.asked();
        const lines = this._printerFormService.formatForm(values);
        this._printerService.print$(lines).subscribe({
            complete: () => {
                this.requestState.completed();
                this._notificationService.addNotification('Sended to printer', ENotificationCode.success);
                this.dialogRef.close();
            },
            error: (error) => {
                this.requestState.onError(error.status, error.statusText);
            },
        });
    }
    _fetch() {
        this.requestState.asked();
        this._printerService.printWizard$(this.data).subscribe(wizard => {
            this.form = this._printerFormService.getForm(wizard);
            this.requestState.completed();
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelModal, deps: [{ token: i1$1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: LabelModal, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "@let wizard = this.wizard() | async;\r\n\r\n@if (wizard) {\r\n  <div class=\"p-space-md\">\r\n    <div class=\"close-dialog\" mat-button mat-dialog-close>\r\n      <mat-icon>close</mat-icon>\r\n    </div>\r\n    <byd-title [level]=\"2\" [isBold]=\"true\">{{ wizard.display_name }}</byd-title>\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        @if (form) {\r\n          <byd-form [inputs]=\"form\" buttonTitle=\"print\" (valid)=\"this.print($event)\"></byd-form>\r\n        }\r\n      </byd-error>\r\n    </byd-loader>\r\n  </div>\r\n}\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "pipe", type: AsyncPipe, name: "async" }, { kind: "directive", type: MatDialogClose, selector: "[mat-dialog-close], [matDialogClose]", inputs: ["aria-label", "type", "mat-dialog-close", "matDialogClose"], exportAs: ["matDialogClose"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelModal, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [LoaderComponent, ErrorComponent, BydTitleComponent, BydFormComponent, MatIcon, AsyncPipe, MatDialogClose], template: "@let wizard = this.wizard() | async;\r\n\r\n@if (wizard) {\r\n  <div class=\"p-space-md\">\r\n    <div class=\"close-dialog\" mat-button mat-dialog-close>\r\n      <mat-icon>close</mat-icon>\r\n    </div>\r\n    <byd-title [level]=\"2\" [isBold]=\"true\">{{ wizard.display_name }}</byd-title>\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        @if (form) {\r\n          <byd-form [inputs]=\"form\" buttonTitle=\"print\" (valid)=\"this.print($event)\"></byd-form>\r\n        }\r\n      </byd-error>\r\n    </byd-loader>\r\n  </div>\r\n}\r\n" }]
        }], ctorParameters: () => [{ type: i1$1.MatDialogRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [MAT_DIALOG_DATA]
                }] }] });

class ContainerComponent extends BydBaseComponent {
    _dialog;
    _printerService = inject(BydPrinterService);
    constructor(_dialog) {
        super();
        this._dialog = _dialog;
        this._registerSubscription(this._printerService.askPrintingWizard$.subscribe(data => {
            this._printerService.printWizard$(data).subscribe();
            this._dialog.open(LabelModal, {
                data,
            });
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ContainerComponent, deps: [{ token: i1$1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ContainerComponent, isStandalone: true, selector: "byd-printer-container", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ContainerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'byd-printer-container',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1$1.MatDialog }] });

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

const provideOdoo = (config) => [
    {
        provide: ODOO_SERVER_CONFIG_KEY,
        useValue: config,
    },
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

class BydEmployeeService extends BydBaseOdooService {
    constructor() {
        super();
    }
    searchByName$(name) {
        return this._odooService
            .searchRead$('hr.employee', [['name', 'ilike', name]], ['id', 'name'])
            .pipe(filter$1(data => !!data));
    }
    getRelatedByUserId$(userId) {
        return this._odooService
            .searchRead$('hr.employee', [['external_app_user', '=', userId]], ['id', 'name'])
            .pipe(filter$1(data => !!data), map$1(data => data[0]));
    }
    getWarehouses$(id) {
        return this._odooService.searchRead$('hr.employee', [['id', '=', id]], ['id', 'warehouse_ids']).pipe(filter$1(data => !!data), map$1(data => data[0]?.warehouse_ids || null));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydEmployeeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydEmployeeService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydEmployeeService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydPartnersService extends BydBaseOdooService {
    partners$ = new BehaviorSubject([]);
    constructor() {
        super();
    }
    fetchList(value) {
        return this._odooService
            .searchRead$('res.partner', [['name', 'ilike', '%' + value.toLowerCase() + '%']], ['id', 'name'], {
            limit: 30,
        })
            .pipe(filter(data => !!data), tap(entities => {
            this.partners$.next(entities);
        }));
    }
    fetchListById(id) {
        return this._odooService
            .searchRead$('res.partner', [['id', '=', id]], ['id', 'name'], { limit: 50 })
            .pipe(filter(data => !!data), tap(entities => {
            this.partners$.next(entities);
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPartnersService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPartnersService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydPartnersService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydWarehousesService extends BydBaseOdooService {
    warehouses = new HandleSimpleRequest();
    warehouse = new HandleSimpleRequest();
    constructor() {
        super();
    }
    fetch$(ids) {
        return this.warehouses.fetch(this._odooService
            .searchRead$('stock.warehouse', [['id', 'in', ids]], ['id', 'name'])
            .pipe(filter$1(data => !!data)));
    }
    get$(id) {
        return this.warehouse.fetch(this._odooService.searchRead$('stock.warehouse', [['id', '=', id]], ['id', 'name']).pipe(filter$1(data => !!data), map$1(data => data[0])));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydWarehousesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydWarehousesService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydWarehousesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BydCompaniesService extends BydBaseOdooService {
    companies = new HandleSimpleRequest();
    company = new HandleSimpleRequest();
    constructor() {
        super();
    }
    fetch$(ids) {
        return this.companies.fetch(this._odooService
            .searchRead$('res.company', [['id', 'in', ids]], ['id', 'name'])
            .pipe(filter$1(data => !!data)));
    }
    get$(id) {
        return this.company.fetch(this._odooService.searchRead$('res.company', [['id', '=', id]], ['id', 'name']).pipe(filter$1(data => !!data), map$1(data => data[0])));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydCompaniesService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydCompaniesService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydCompaniesService, decorators: [{
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

export { BydAttachementsService, BydAuthOdooService, BydBaseOdooService, BydCompaniesService, BydEmployeeService, BydMessagesComponent, BydMessagesService, BydPartnersService, BydPrinterService, BydScanPackingComponent, BydScanPackingService, BydScanningComponent, BydUploadComponent, BydWarehousesService, ContainerComponent, ODOO_SERVER_CONFIG_KEY, TargetUrlInterceptor, provideOdoo };
//# sourceMappingURL=beyond-odoo.mjs.map
