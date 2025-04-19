import * as i0 from '@angular/core';
import { EventEmitter, Output, Input, Component, InjectionToken, inject, Injectable, Inject } from '@angular/core';
import { takeImage, picImages, getFirstString, getBase64FromFile, BydBaseComponent, getFirstNumber } from '@beyond/utils';
import { InputTextBox, InputDropdown, InputPanel, InputLabel, InputNumber, InputCheckBox } from '@beyond/form-model';
import { BydButtonComponent, LoaderComponent, ErrorComponent, EmptyComponent, CardComponent, CardHeaderComponent, CardTitleComponent, BydTitleComponent } from '@beyond/ui';
import { TextBoxComponent } from '@beyond/form-input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@beyond/translation';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { tap, map, Subject, BehaviorSubject, filter, mergeMap, of, forkJoin } from 'rxjs';
import { BydNotificationService, ENotificationCode } from '@beyond/notification';
import { BydPermissionsServices } from '@beyond/server';
import * as i1 from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as i2 from '@zxing/ngx-scanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { map as map$1, filter as filter$1, mergeMap as mergeMap$1, tap as tap$1, switchMap } from 'rxjs/operators';
import { BydFormComponent } from '@beyond/form-basic';
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
                'target-url': this.server.odooUrl
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
            attachments.push({ name: 'attachments by app', datas: base64, res_model: "mail.message" });
        }
        return this._odooService.create$('mail.message', { ...message, ...{ subtype_id: 2 } })
            .pipe(filter(data => !!data), mergeMap(data => {
            if (attachments.length === 0) {
                return of(data);
            }
            return forkJoin([...attachments.map(attachment => this._odooService.create$('ir.attachment', { ...attachment, ...{ res_id: data.id } }))]);
        }));
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
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydMessagesComponent, isStandalone: true, selector: "byd-messages", inputs: { id: "id", model: "model" }, usesInheritance: true, ngImport: i0, template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div class=\"grid align-items-center mb-space-xs\">\r\n        <div *ngFor=\"let pic of this.tempImages\" class=\"temp-pic-container g-col-3\">\r\n          <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n          <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n            <mat-icon>close</mat-icon>\r\n          </div>\r\n        </div>\r\n        <!-- <div>\r\n          <byd-files-upload (filesPicked)=\"this.uploadImage($event)\" [features]=\"['take-pic']\"></byd-files-upload>\r\n        </div> -->\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"grid\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\" class=\"g-col-3\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}.temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"], dependencies: [{ kind: "component", type: BydButtonComponent, selector: "byd-button", inputs: ["state", "type", "size", "icon", "options", "stopPropagationActivation"], outputs: ["action"] }, { kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "component", type: TextBoxComponent, selector: "byd-input-textbox", inputs: ["input", "matcher", "space"], outputs: ["valueChanged"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }, { kind: "directive", type: NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: NgFor, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "pipe", type: AsyncPipe, name: "async" }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydMessagesComponent, decorators: [{
            type: Component,
            args: [{ selector: 'byd-messages', standalone: true, imports: [BydButtonComponent, LoaderComponent, ErrorComponent, TextBoxComponent, MatIcon, BydUploadComponent, NgIf, NgFor, AsyncPipe], template: "<div>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <div>\r\n        <byd-input-textbox [input]=\"this.input\"></byd-input-textbox>\r\n      </div>\r\n\r\n      <div class=\"grid align-items-center mb-space-xs\">\r\n        <div *ngFor=\"let pic of this.tempImages\" class=\"temp-pic-container g-col-3\">\r\n          <img [src]=\"pic.localUrl\" width=\"100%\" />\r\n          <div class=\"remove-cta\" (click)=\"this.remove(pic)\">\r\n            <mat-icon>close</mat-icon>\r\n          </div>\r\n        </div>\r\n        <!-- <div>\r\n          <byd-files-upload (filesPicked)=\"this.uploadImage($event)\" [features]=\"['take-pic']\"></byd-files-upload>\r\n        </div> -->\r\n      </div>\r\n\r\n      <byd-button (action)=\"this.send()\" [state]=\"this.disable ? 'disabled' : 'classic'\">\r\n        <mat-icon>send</mat-icon> Send\r\n      </byd-button>\r\n\r\n      <div>\r\n        <div *ngFor=\"let message of this.data$ | async\" class=\"item-message\">\r\n          <div [innerHTML]=\"message.body\"></div>\r\n          <hr *ngIf=\"(message.body && message.attachment_ids?.length) || 0 > 0\" />\r\n          <div class=\"grid\">\r\n            <div *ngFor=\"let picId of message.attachment_ids\" class=\"g-col-3\">\r\n              <img [src]=\"this.getPicUrl(picId)\" width=\"100%\" />\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [".item-message{margin:5px 0;padding:5px;border:1px solid var(--byd-surface-brand-primary);border-radius:5px}.temp-pic-container{position:relative;padding:2px}.remove-cta{position:absolute;top:0;right:2px}\n"] }]
        }], ctorParameters: () => [{ type: AppMessagesService }], propDecorators: { id: [{
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
    lookForPacking(id) {
        return this._odooService
            .action$('sale.order', 'search_by_sale_order_id', id)
            .pipe(filter(data => !!data));
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

class ScanPackingDialog extends BydBaseComponent {
    dialogRef;
    data;
    _scanPackingService = inject(BydScanPackingService);
    _notificationService = inject(BydNotificationService);
    step = 'scan';
    activeScope = null;
    searchResult = null;
    get scopes() {
        return this.data?.scopes || [];
    }
    get noData() {
        return (!this.searchResult ||
            (this.searchResult.deliveries.length === 0 &&
                this.searchResult.returns.length === 0 &&
                this.searchResult.work_orders.length === 0));
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
        if (model?.toLocaleLowerCase() !== 'sale.order') {
            this._notificationService.addErrorNotification('QR core is not valid (model)');
            this.dialogRef.close();
            return;
        }
        this.step = 'search';
        this._scanPackingService.lookForPacking(id).subscribe({
            next: searchResult => {
                this._processSearchResult(searchResult);
                this.requestState.completed();
            },
            error: () => {
                this.dialogRef.close();
            },
        });
    }
    permissionResponse(repsonse) {
        if (!repsonse) {
            this._notificationService.addErrorNotification('Permission not granted');
            this.dialogRef.close();
            return;
        }
    }
    getDataByScope(scope) {
        switch (scope.key) {
            case 'workcenter':
                return this.searchResult?.work_orders || [];
            case 'delivery':
                return this.searchResult?.deliveries || [];
            case 'return':
                return this.searchResult?.returns || [];
            default:
                return [];
        }
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
        scope.navigation(item.type);
    }
    _processSearchResult(searchResult) {
        this.searchResult = searchResult;
        if (searchResult.deliveries.length + searchResult.returns.length + searchResult.work_orders.length !== 1) {
            return;
        }
        if (searchResult.deliveries.length > 0) {
            this.navigateTo(this._getScopeByKey('delivery'), searchResult.deliveries[0]);
            return;
        }
        if (searchResult.returns.length > 0) {
            this.navigateTo(this._getScopeByKey('return'), searchResult.returns[0]);
            return;
        }
        if (searchResult.work_orders.length > 0) {
            this.navigateTo(this._getScopeByKey('workcenter'), searchResult.work_orders[0]);
            return;
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ScanPackingDialog, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "19.2.1", type: ScanPackingDialog, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<div class=\"p-15\">\r\n  @if (this.step === 'scan') {\r\n    <zxing-scanner\r\n      (scanSuccess)=\"this.scanSuccess($event)\"\r\n      (permissionResponse)=\"this.permissionResponse($event)\"\r\n    ></zxing-scanner>\r\n  } @else if (this.step === 'search') {\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        <byd-empty [isEmpty]=\"this.noData\" [isLight]=\"false\">\r\n          <div class=\"grid\">\r\n            @for (scope of this.scopes; track scope) {\r\n              @if (this.getDataByScope(scope).length > 0) {\r\n                <div>\r\n                  <byd-card [highlight]=\"this.activeScope?.key === scope.key\" (click)=\"this.setScope(scope)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ 'scan.' + scope + '.name' | translate }} ({{ this.getDataByScope(scope).length }})\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            }\r\n          </div>\r\n          @if (this.activeScope) {\r\n            <div>\r\n              @for (item of this.getDataByScope(this.activeScope); track item) {\r\n                <div\r\n                  class=\"d-flex justify-content-between m-10 bdB fs-5\"\r\n                  (click)=\"this.navigateTo(this.activeScope, item)\"\r\n                >\r\n                  <div>\r\n                    {{ item.name }}\r\n                  </div>\r\n                  <div>\r\n                    <mat-icon>chevron_right</mat-icon>\r\n                  </div>\r\n                </div>\r\n              }\r\n            </div>\r\n          }\r\n        </byd-empty>\r\n      </byd-error>\r\n    </byd-loader>\r\n  }\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: EmptyComponent, selector: "byd-empty", inputs: ["isEmpty", "isLight", "showMessage", "text", "type", "icon", "iconSize"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "ngmodule", type: ZXingScannerModule }, { kind: "component", type: i2.ZXingScannerComponent, selector: "zxing-scanner", inputs: ["autofocusEnabled", "timeBetweenScans", "delayBetweenScanSuccess", "autostart", "previewFitMode", "poster", "device", "formats", "videoConstraints", "torch", "enable", "tryHarder"], outputs: ["autostarted", "autostarting", "torchCompatible", "scanSuccess", "scanFailure", "scanError", "scanComplete", "camerasFound", "camerasNotFound", "permissionResponse", "hasDevices", "deviceChange"] }, { kind: "component", type: CardComponent, selector: "byd-card", inputs: ["highlight", "shadow", "fullHeight", "noContent", "isNew"], outputs: ["click"] }, { kind: "component", type: CardHeaderComponent, selector: "byd-card-header" }, { kind: "component", type: CardTitleComponent, selector: "byd-card-title" }, { kind: "pipe", type: TranslatePipe, name: "translate" }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ScanPackingDialog, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [LoaderComponent, EmptyComponent, ErrorComponent, ZXingScannerModule, CardComponent, CardHeaderComponent, CardTitleComponent, TranslatePipe, MatIcon], template: "<div class=\"p-15\">\r\n  @if (this.step === 'scan') {\r\n    <zxing-scanner\r\n      (scanSuccess)=\"this.scanSuccess($event)\"\r\n      (permissionResponse)=\"this.permissionResponse($event)\"\r\n    ></zxing-scanner>\r\n  } @else if (this.step === 'search') {\r\n    <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n      <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n        <byd-empty [isEmpty]=\"this.noData\" [isLight]=\"false\">\r\n          <div class=\"grid\">\r\n            @for (scope of this.scopes; track scope) {\r\n              @if (this.getDataByScope(scope).length > 0) {\r\n                <div>\r\n                  <byd-card [highlight]=\"this.activeScope?.key === scope.key\" (click)=\"this.setScope(scope)\">\r\n                    <byd-card-header class=\"ta-c\">\r\n                      <byd-card-title>\r\n                        {{ 'scan.' + scope + '.name' | translate }} ({{ this.getDataByScope(scope).length }})\r\n                      </byd-card-title>\r\n                    </byd-card-header>\r\n                  </byd-card>\r\n                </div>\r\n              }\r\n            }\r\n          </div>\r\n          @if (this.activeScope) {\r\n            <div>\r\n              @for (item of this.getDataByScope(this.activeScope); track item) {\r\n                <div\r\n                  class=\"d-flex justify-content-between m-10 bdB fs-5\"\r\n                  (click)=\"this.navigateTo(this.activeScope, item)\"\r\n                >\r\n                  <div>\r\n                    {{ item.name }}\r\n                  </div>\r\n                  <div>\r\n                    <mat-icon>chevron_right</mat-icon>\r\n                  </div>\r\n                </div>\r\n              }\r\n            </div>\r\n          }\r\n        </byd-empty>\r\n      </byd-error>\r\n    </byd-loader>\r\n  }\r\n</div>\r\n" }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingComponent, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: BydScanPackingComponent, isStandalone: true, selector: "byd-scan-packing", inputs: { scopes: "scopes" }, usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: BydScanPackingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'byd-scan-packing',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.MatDialog }], propDecorators: { scopes: [{
                type: Input
            }] } });

class BydPrinterService extends BydBaseOdooService {
    askPrintingWizard$ = new Subject();
    printers$ = new BehaviorSubject([]);
    _printWizard$ = new BehaviorSubject({});
    constructor() {
        super();
    }
    getPrintWizard$(id) {
        return this._printWizard$.pipe(map$1(data => data[id]), filter$1(myData => !!myData));
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
        return model.pipe(filter$1(data => !!data), map$1(data => data[0]), mergeMap$1(entity => this._odooService
            .searchRead$('print.direct.wizard.line', [['id', 'in', entity.print_lines]], ['id', 'display_name', 'print_qty', 'printer_id'])
            .pipe(map$1(lines => ({
            ...entity,
            ...{
                lines,
            },
        })))), tap$1(entity => {
            const entities = this._printWizard$.getValue();
            entities[entity.id] = entity;
            this._printWizard$.next(entities);
        }));
    }
    fetchPrinters$() {
        return this._odooService
            .searchRead$('remote.printer.printer', [], ['id', 'name'])
            .pipe(tap$1(list => this.printers$.next(list)));
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
            class: 'col-5',
            options: this._printerService.printers$.pipe(map$1(printers => printers.map(printer => ({
                id: printer.id.toString(),
                name: printer.name,
            })))),
        });
        printerlistInput.changeValue$.subscribe(value => {
            printerItemsInput.forEach(item => (item.value = (value ? value : null)));
        });
        /* Qty */
        // const qtyItemsInput: InputNumber[] = [];
        // const qtylistInput = new InputNumber({
        //   key: 'qty',
        //   class: 'col-2',
        // });
        // qtylistInput.changeValue$.subscribe(value => {
        //   qtyItemsInput.forEach(item => (value ? item.formControl.setValue(value) : null));
        // });
        return [
            new InputPanel({
                key: 'panel',
                class: 'col-9',
                children: [
                    new InputPanel({
                        key: 'panel',
                        class: 'p-15',
                        contentClass: 'row align-items-center',
                        children: [
                            new InputLabel({
                                key: 'label',
                                label: 'Printer: ',
                                class: 'col-auto',
                            }),
                            printerlistInput,
                        ],
                    }),
                    new InputPanel({
                        key: 'panel',
                        contentClass: 'row align-items-center fs-5',
                        children: [
                            new InputLabel({
                                key: 'label',
                                label: 'Label for',
                                class: 'col-7 ta-c',
                            }),
                            new InputLabel({
                                key: 'label',
                                label: 'Quantity',
                                class: 'col-2 ta-c',
                            }),
                            new InputLabel({
                                key: 'label',
                                label: 'Printer',
                                class: 'col-3 ta-c',
                            }),
                        ],
                    }),
                    ...(wizard.lines?.map(line => {
                        /** Print */
                        const printerInput = new InputDropdown({
                            key: 'line-' + line.id + '-printer',
                            class: 'col-3',
                            showNothingOption: true,
                            options: this._printerService.printers$.pipe(map$1(printers => printers.map(printer => ({
                                id: printer.id.toString(),
                                name: printer.name,
                            })))),
                            value: getFirstNumber(line.printer_id)?.toString(),
                        });
                        printerItemsInput.push(printerInput);
                        /** qty */
                        const qtyInput = new InputNumber({
                            key: 'line-' + line.id + '-qty',
                            class: 'col-2',
                            value: line.print_qty.toString(),
                        });
                        // qtyItemsInput.push(qtyInput);
                        return new InputPanel({
                            key: 'panel',
                            contentClass: 'row align-items-center',
                            children: [
                                new InputCheckBox({
                                    key: 'line-' + line.id + '-check',
                                    class: 'col-1',
                                    toggle: true,
                                    value: true,
                                }),
                                new InputLabel({
                                    key: 'label-' + line.id,
                                    label: line.display_name,
                                    class: 'col-6 fs-5',
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
    wizard = null;
    get displayName() {
        return this.wizard?.display_name || (this.wizard?.lines || [])[0].display_name || '';
    }
    constructor(dialogRef, data) {
        super();
        this.dialogRef = dialogRef;
        this.data = data;
        this.requestState.asked();
        this._printerService.getPrintWizard$(this.data.id).subscribe(wizard => {
            this.form = this._printerFormService.getForm(wizard);
            this.wizard = wizard;
            this.requestState.completed();
        });
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelModal, deps: [{ token: i1.MatDialogRef }, { token: MAT_DIALOG_DATA }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: LabelModal, isStandalone: true, selector: "ng-component", usesInheritance: true, ngImport: i0, template: "<div class=\"pspace-md\">\r\n  <div class=\"close-dialog\" mat-button mat-dialog-close>\r\n    <mat-icon> close </mat-icon>\r\n  </div>\r\n  <byd-title>{{ this.displayName }}</byd-title>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <byd-form *ngIf=\"form\" [inputs]=\"form\" buttonTitle=\"print\" (valid)=\"this.print($event)\"></byd-form>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n", styles: [""], dependencies: [{ kind: "component", type: LoaderComponent, selector: "byd-loader", inputs: ["isLoading", "skeleton"] }, { kind: "component", type: ErrorComponent, selector: "byd-error", inputs: ["message", "code"] }, { kind: "component", type: BydTitleComponent, selector: "byd-title", inputs: ["level", "isTheme", "isBold"] }, { kind: "component", type: BydFormComponent, selector: "byd-form", inputs: ["inputs", "askValidation$", "askOnDestroy", "loader", "error", "border", "canDisplayButton", "buttonTitle", "onLive"], outputs: ["valid", "isFormValid"] }, { kind: "component", type: MatIcon, selector: "mat-icon", inputs: ["color", "inline", "svgIcon", "fontSet", "fontIcon"], exportAs: ["matIcon"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: LabelModal, decorators: [{
            type: Component,
            args: [{ selector: '', standalone: true, imports: [LoaderComponent, ErrorComponent, BydTitleComponent, BydFormComponent, MatIcon], template: "<div class=\"pspace-md\">\r\n  <div class=\"close-dialog\" mat-button mat-dialog-close>\r\n    <mat-icon> close </mat-icon>\r\n  </div>\r\n  <byd-title>{{ this.displayName }}</byd-title>\r\n  <byd-loader [isLoading]=\"this.requestState.isLoading()\">\r\n    <byd-error [message]=\"this.requestState.getErrorMessage()\" [code]=\"this.requestState.getErrorStatus()\">\r\n      <byd-form *ngIf=\"form\" [inputs]=\"form\" buttonTitle=\"print\" (valid)=\"this.print($event)\"></byd-form>\r\n    </byd-error>\r\n  </byd-loader>\r\n</div>\r\n" }]
        }], ctorParameters: () => [{ type: i1.MatDialogRef }, { type: undefined, decorators: [{
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ContainerComponent, deps: [{ token: i1.MatDialog }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "19.2.1", type: ContainerComponent, isStandalone: true, selector: "byd-printer-container", usesInheritance: true, ngImport: i0, template: '', isInline: true });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.1", ngImport: i0, type: ContainerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'byd-printer-container',
                    template: '',
                }]
        }], ctorParameters: () => [{ type: i1.MatDialog }] });

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

/*
 * Public API Surface of odoo
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AppMessagesService, BydAuthOdooService, BydBaseOdooService, BydMessagesComponent, BydScanPackingComponent, BydScanPackingService, BydUploadComponent, ContainerComponent, ODOO_SERVER_CONFIG_KEY, TargetUrlInterceptor, provideOdoo };
//# sourceMappingURL=beyond-odoo.mjs.map
