import { isNonNullable, ObjectKeys, isURL, newId } from '@beyond/utils';
import { BehaviorSubject, tap, map, filter, Subject, switchMap, take, of, share } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, importProvidersFrom } from '@angular/core';
import { ApolloLink, InMemoryCache, ApolloClient } from '@apollo/client/core';
import * as i1 from 'apollo-angular/http';
import * as i2 from 'apollo-angular';
import { ApolloModule } from 'apollo-angular';
export { gql as Apollo_gql } from 'apollo-angular';
import { differenceInMinutes } from 'date-fns';
import { map as map$1 } from 'rxjs/operators';

class GraphSchema {
    _fields;
    constructor(_fields) {
        this._fields = _fields;
    }
    get(field) {
        return this._fields.find(x => x === field);
    }
}

const keyValueProps = new GraphSchema(['key', 'value']);

class HandleComplexRequest {
    data$ = new BehaviorSubject({});
    constructor() { }
    fetch(id, subscriber) {
        return subscriber.pipe(tap(entity => {
            const entities = this.data$.getValue();
            entities[id] = entity;
            this.data$.next(entities);
        }));
    }
    update(id, item, merge = true) {
        const entities = this.data$.getValue();
        if (!entities[id]) {
            entities[id] = item; // Initialize if not present
        }
        else {
            entities[id] = merge ? { ...entities[id], ...item } : item;
        }
        this.data$.next(entities);
    }
    get(key) {
        return this.data$.getValue()[key] ?? null;
    }
    get$(key) {
        return this.data$.pipe(map(data => data[key]), filter(data => !!data));
    }
}
class HandleSimpleRequest {
    data$ = new BehaviorSubject(null);
    constructor() { }
    fetch(subscriber) {
        return subscriber.pipe(filter(isNonNullable), tap(entity => {
            this.data$.next(entity);
        }));
    }
    get() {
        return this.data$.getValue() ?? null;
    }
    get$() {
        return this.data$.pipe(filter(data => !!data));
    }
}

class Logger {
    static DEBUG = 0;
    static INFO = 1;
    static WARNING = 2;
    static ERROR = 3;
    static config = { DEBUG: true, DEBUG_LEVEL: Logger.DEBUG };
    static LogDebug(message, data) {
        if (data === undefined) {
            data = '';
        }
        if (Logger.config.DEBUG && Logger.DEBUG >= Logger.config.DEBUG_LEVEL) {
            // tslint:disable-next-line:no-console
            console.debug(message, data);
        }
        this._fsLog('log', message, data);
    }
    static LogInfo(message, ...data) {
        if (Logger.config.DEBUG && Logger.INFO >= Logger.config.DEBUG_LEVEL) {
            // tslint:disable-next-line:no-console
            console.info(message, data);
        }
        this._fsLog('info', message, data);
    }
    static LogWarning(message, data) {
        if (data === undefined) {
            data = '';
        }
        if (Logger.config.DEBUG && Logger.WARNING >= Logger.config.DEBUG_LEVEL) {
            console.warn('/!\\ ' + message + ' /!\\', data);
        }
        this._fsLog('warn', message, data);
    }
    static LogError(message, data) {
        if (data === undefined) {
            data = '';
        }
        if (Logger.config.DEBUG && Logger.ERROR >= Logger.config.DEBUG_LEVEL) {
            console.error('/!\\ ' + message + ' /!\\', data);
        }
        this._fsLog('error', message, data);
    }
    static _fsLog(logLevel, message, data) {
        if (window.FS) {
            window.FS.log(logLevel, `${message} | data: ${JSON.stringify(data)}`);
        }
    }
}

class RequestMapCore {
    mappingApi = {};
    register(routes) {
        for (const key in routes) {
            this.mappingApi[key] = routes[key];
        }
    }
    getConfigById(id) {
        return this._getConfigById(id);
    }
    parseUrl(data) {
        return this._formatUrl(data.serverUrl, data.url, data.request) + '' + (data.apiExt ?? '');
    }
    _getConfigById(id) {
        if (this.mappingApi.hasOwnProperty(id)) {
            return this.mappingApi[id];
        }
        Logger.LogError('No Api Configuration found for: ', id);
        return null;
    }
    _formatUrl(serverUrl, url, request) {
        return url.replace(/{(\w+)}/g, function (match, string) {
            if (request.urlData !== null && request.urlData.hasOwnProperty(string)) {
                return request.urlData[string];
            }
            if (request.BrutContent !== null && request.BrutContent.hasOwnProperty(string)) {
                return request.BrutContent[string];
            }
            if (string === 'ApiUrl') {
                return serverUrl;
            }
            return match;
        });
    }
}
const RequestMap = new RequestMapCore();

var StatusReponse;
(function (StatusReponse) {
    StatusReponse[StatusReponse["Unknown"] = 0] = "Unknown";
    StatusReponse[StatusReponse["Successful"] = 200] = "Successful";
    StatusReponse[StatusReponse["NoContent"] = 204] = "NoContent";
    StatusReponse[StatusReponse["Unauthorized"] = 401] = "Unauthorized";
    StatusReponse[StatusReponse["Forbidden"] = 403] = "Forbidden";
    StatusReponse[StatusReponse["Error"] = 500] = "Error";
})(StatusReponse || (StatusReponse = {}));

const SERVER_CONFIG_KEY = new InjectionToken('config_server');
class BydServerSevice {
    _config = inject(SERVER_CONFIG_KEY);
    $http = inject(HttpClient);
    get requestInProgressNumber() {
        return this._correlations.length;
    }
    _tempLoginRequiredRequest = [];
    _tempPendingRequest = [];
    _correlations = [];
    _isAuthenticated = false;
    get isAuthenticated() {
        return this._isAuthenticated;
    }
    set isAuthenticated(value) {
        this._isAuthenticated = value;
        if (this._isAuthenticated) {
            this._retryLoginRequired();
        }
    }
    constructor() { }
    registerRoutes(routes) {
        RequestMap.register(routes);
    }
    request(request) {
        const subject = new Subject();
        this._send(subject, request);
        return subject;
    }
    retryRequest(list = []) {
        for (const request of list) {
            this._send(request.subject, request.request);
        }
    }
    _send(subject, request) {
        if (!this._config) {
            return;
        }
        // le user doit etre connecté
        if (request.loginRequired === true && this.isAuthenticated === false) {
            this._tempLoginRequiredRequest.push({
                request: request,
                subject: subject,
            });
            return;
        }
        if (this.requestInProgressNumber >= this._config.pendindRequestId) {
            this._tempPendingRequest.push({ request: request, subject: subject });
            return;
        }
        this._addCorrelation(request.id, request, subject);
        this._sendRequest(request);
    }
    _sendRequest(request) {
        if (!this._config) {
            return;
        }
        const requestConfig = RequestMap.getConfigById(request.type);
        if (!requestConfig) {
            return;
        }
        const url = RequestMap.parseUrl({
            serverUrl: this._config.serverUrl,
            url: requestConfig.url,
            request,
            apiExt: this._config.apiExt,
        });
        Logger.LogInfo('[SERVER] Api Request:', url, request);
        switch (requestConfig.type) {
            case 'GET':
                this._get(url, request);
                break;
            case 'POST':
                this._post(url, request);
                break;
            case 'PUT':
                this._put(url, request);
                break;
            case 'PATCH':
                this._patch(url, request);
                break;
            case 'DELETE':
                this._delete(url, request);
                break;
            case 'FILES':
                this._files(url, request);
                break;
            case 'UPDATEFILES':
                this._updateFiles(url, request);
                break;
            default:
                Logger.LogError('[ERROR] Request not send');
        }
    }
    _onPacketReceived = (id, response) => {
        Logger.LogInfo('[SERVER] Api Reponse:', response);
        this._resolveCorrelation(id, response.body);
    };
    _addCorrelation(corrId, request, sub) {
        this._correlations.push({ id: corrId, request: request, subject: sub });
    }
    _resolveCorrelation = (corrId, body) => {
        const correlation = this._correlations.find(item => item.id === corrId);
        if (!correlation) {
            return;
        }
        let content;
        if (typeof body === 'string') {
            try {
                content = JSON.parse(body);
            }
            catch (error) {
                content = body;
            }
        }
        else {
            content = body;
        }
        this._resolveResponseStatus(correlation, content);
        this._correlations = this._correlations.filter(item => item !== correlation);
        if (this.requestInProgressNumber === 0) {
            this._retryPending();
        }
    };
    _resolveResponseStatus(correlation, content) {
        Logger.LogInfo('[SERVER] Api Reponse content:', content.Status, content.Content);
        switch (content.Status) {
            case StatusReponse.Successful:
            case StatusReponse.NoContent:
                correlation.subject.next(content.Content);
                correlation.subject.complete();
                correlation.subject.unsubscribe();
                break;
            default:
                correlation.subject.error(content.Content);
                correlation.subject.complete();
                correlation.subject.unsubscribe();
        }
    }
    _retryPending() {
        const list = [...this._tempPendingRequest];
        this._tempPendingRequest = [];
        this.retryRequest(list);
    }
    _retryLoginRequired() {
        const list = [...this._tempLoginRequiredRequest];
        this._tempLoginRequiredRequest = [];
        this.retryRequest(list);
    }
    _get(url, request) {
        this.$http
            .get(url, {
            headers: this._headers(),
            params: { cacheTime: request.cacheTime },
        })
            .subscribe({
            next: response => {
                this._onPacketReceived(request.id, this._formatReponse(response, 200));
            },
            error: message => {
                this._onPacketReceived(request.id, this._formatReponse(message, message.status));
            },
            complete: () => Logger.LogDebug('API GET CLOSE'),
        });
    }
    _post(url, request) {
        this.$http
            .post(url, request.BrutContent, {
            headers: this._headers(),
        })
            .subscribe({
            next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API POST CLOSE'),
        });
    }
    _patch(url, request) {
        this.$http.patch(url, request.Content, { headers: this._headers() }).subscribe({
            next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API PATCH CLOSE'),
        });
    }
    _put(url, request) {
        this.$http.put(url, request.Content, { headers: this._headers() }).subscribe({
            next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API PUT CLOSE'),
        });
    }
    _delete(url, request) {
        this.$http.delete(url, { headers: this._headers() }).subscribe({
            next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API DELETE CLOSE'),
        });
    }
    _files(url, request) {
        this.$http
            .post(url, request.BrutContent.files, {
            headers: this._headers({
                contentType: '',
            }),
        })
            .subscribe({
            next: response => {
                this._onPacketReceived(request.id, this._formatReponse(response));
            },
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API DELETE CLOSE'),
        });
    }
    _updateFiles(url, request) {
        this.$http
            .put(url, request.BrutContent.files, {
            headers: this._headers({
                contentType: '',
            }),
        })
            .subscribe({
            next: response => {
                this._onPacketReceived(request.id, this._formatReponse(response));
            },
            error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
            complete: () => Logger.LogDebug('API DELETE CLOSE'),
        });
    }
    _formatReponse(response, status = 200) {
        return { body: { Status: status, Content: response } };
    }
    _headers(option) {
        let headers = new HttpHeaders();
        if (option?.contentType !== '') {
            headers = headers.set('Content-Type', option?.contentType ? option?.contentType : 'application/json');
        }
        headers = headers.set('Access-Control-Allow-Origin', this._config?.serverUrl ?? '');
        Logger.LogInfo('[SERVER] Api Request Header:', headers);
        return headers;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydServerSevice, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydServerSevice, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydServerSevice, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

const GRAPHQL_SERVER_CONFIG = new InjectionToken('config_graphQl_server');

const graphQlBydke = (take) => {
    return `take: ${take || 1000}`;
};
const graphQlPaginationFields = () => {
    return `
        pageInfo {
            hasNextPage
            hasPreviousPage
        }
        totalCount
    `;
};

const graphQlUpdateFields = (object) => {
    return { updatedFields: ObjectKeys(object) };
};

class BydGraphService {
    httpLink;
    apollo;
    _graphConfig = inject(GRAPHQL_SERVER_CONFIG);
    contactsLoaded$ = new BehaviorSubject(false);
    isReady$ = new BehaviorSubject(true);
    _defaultEndpoint;
    _cache;
    constructor(httpLink, apollo) {
        this.httpLink = httpLink;
        this.apollo = apollo;
        this._defaultEndpoint = new ApolloLink((operation, forward) => {
            return forward(operation);
        });
        this._cache = new InMemoryCache();
        //  (<any>window).apolloCache = this._cache;
        this.apollo.client = new ApolloClient({
            cache: this._cache,
            link: this._defaultEndpoint,
        });
    }
    clearCache(key) {
        this._cache.evict({
            fieldName: key,
        });
    }
    fetchQueryList(payload, node, context) {
        return this._getWrapper({ context }).pipe(tap(() => Logger.LogInfo('[GraphQL] [Query] fetchQueryList:', { payload, node, context })), switchMap(() => this.apollo.query(this._setupData(payload, context)).pipe(tap(data => Logger.LogInfo('[GraphQL] [Response] fetchQueryList:', { data, node, context })), filter(response => !!response.data), map(response => response.data[node]))), take(1));
    }
    fetchPagedQueryList(payload, node, context) {
        Logger.LogInfo('[GraphQL] [Prepare] fetchPagedQueryList:', { payload, node, context });
        return this._getWrapper({ context }).pipe(tap(() => Logger.LogInfo('[GraphQL] [Query] fetchPagedQueryList:', { payload, node, context })), switchMap(() => this.apollo.query(this._setupData(payload, context)).pipe(tap(data => Logger.LogInfo('[GraphQL] [Response] fetchPagedQueryList:', { data, node, context })), filter(response => !!response.data), map(response => response.data[node]))), take(1));
    }
    fetchQuery(payload, node, context) {
        return this._getWrapper({ context }).pipe(tap(() => Logger.LogInfo('[GraphQL] [Query] fetchQuery:', { payload, node, context })), switchMap(() => this.apollo.query(this._setupData(payload, context)).pipe(tap(data => Logger.LogInfo('[GraphQL] [Response] fetchQuery:', { data, node, context })), filter(response => !!response.data), map(data => data.data[node]))), take(1));
    }
    mutate(payload, mutationName, context, clearCache) {
        Logger.LogInfo('[GraphQL]  [Prepare] mutate', payload, mutationName);
        return this.apollo.mutate(this._setupData(payload, context)).pipe(tap(data => Logger.LogInfo('[GraphQL] [Reponse] mutate', data)), filter(response => !!response.data), tap(() => clearCache?.forEach(cacheKey => this.clearCache(cacheKey))), map(response => {
            return response.data[mutationName];
        }));
    }
    registerGraphEndpoint(graphEndpoint) {
        let uri = isURL(graphEndpoint.endpoint) ? graphEndpoint.endpoint : this._graphConfig.url + graphEndpoint.endpoint;
        const newHttpLink = this.httpLink.create({
            headers: graphEndpoint.headers,
            uri: uri,
        });
        this.apollo.client.setLink(this.apollo.client.link.concat(ApolloLink.split(operation => operation.getContext()['clientName'] === graphEndpoint.clientName, newHttpLink)));
    }
    _setupData(payload, context) {
        return { ...payload, ...{ context: { clientName: context } } };
    }
    _getWrapper(data) {
        return this.isReady$;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydGraphService, deps: [{ token: i1.HttpLink }, { token: i2.Apollo }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydGraphService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydGraphService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.HttpLink }, { type: i2.Apollo }] });

class BydBaseService {
    _subscriptionList = [];
    _serverService = inject(BydServerSevice);
    _graphService = inject(BydGraphService);
    constructor(apiRoutes) {
        this.registerRoutes({ apiRoutes });
    }
    registerRoutes(routes) {
        if (routes.apiRoutes)
            this._serverService.registerRoutes(routes.apiRoutes);
        if (routes.graphEndpoint)
            this._graphService.registerGraphEndpoint(routes.graphEndpoint);
    }
    ngOnDestroy() {
        this._subscriptionList.forEach(subscription => subscription.unsubscribe());
    }
    _registerSubscription(subscription) {
        this._subscriptionList.push(subscription);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydBaseService, deps: "invalid", target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydBaseService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydBaseService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: undefined }] });

class CacheInterceptor {
    cache = new Map();
    intercept(req, next) {
        if (req.method !== 'GET') {
            return next.handle(req);
        }
        const cacheTime = Number(req.params.get('cacheTime'));
        if (cacheTime === 0) {
            Logger.LogInfo('[SERVER] Api No Cache required', req.url);
            return next.handle(req);
        }
        const cachedResponse = this.cache.get(req.url);
        if (cachedResponse) {
            const diffInMinutes = differenceInMinutes(new Date(), cachedResponse?.timestamp);
            if (cacheTime === -1 || cacheTime > diffInMinutes) {
                Logger.LogInfo('[SERVER] Api Cached response:', req.url, cachedResponse);
                return of(cachedResponse.response.clone());
            }
            else {
                Logger.LogInfo('[SERVER] Api Cached expired', req.url);
            }
        }
        return next.handle(req).pipe(tap((stateEvent) => {
            if (stateEvent instanceof HttpResponse) {
                this.cache.set(req.url, {
                    timestamp: new Date(),
                    response: stateEvent.clone(),
                });
            }
        }), share());
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: CacheInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: CacheInterceptor });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: CacheInterceptor, decorators: [{
            type: Injectable
        }] });

var ECacheStrategy;
(function (ECacheStrategy) {
    ECacheStrategy[ECacheStrategy["Inifity"] = -1] = "Inifity";
    ECacheStrategy[ECacheStrategy["NoCache"] = 0] = "NoCache";
})(ECacheStrategy || (ECacheStrategy = {}));

class Request {
    id;
    type;
    loginRequired;
    cacheTime;
    urlData;
    _content;
    get Content() {
        return JSON.stringify(this._content);
    }
    get BrutContent() {
        return this._content;
    }
    constructor({ type, content = null, urlData = null, cacheTime = ECacheStrategy.NoCache, loginRequired = true, }) {
        this.id = newId();
        this.type = type;
        this.loginRequired = loginRequired;
        this.cacheTime = cacheTime;
        this.urlData = urlData;
        this._content = content;
    }
}

const GRAPHQL_CONFIG_TOKEN = new InjectionToken('IGraphConfig');

class BydPermissionsServices {
    _updated$ = new BehaviorSubject(null);
    uid = null;
    pass = null;
    token = null;
    guards = {};
    roles = ['shared'];
    warehouse = null;
    company = null;
    employee = null;
    get isAuthenticated() {
        return !!this.uid;
    }
    updated$ = this._updated$.pipe(filter(data => !!data));
    _sep = '##--##';
    get received() {
        return this._updated$.value !== null;
    }
    constructor() {
        if (sessionStorage.getItem('token')) {
            const token = sessionStorage.getItem('token').split(this._sep);
            this.uid = Number(token[0]);
            this.pass = token[1];
            this._updated$.next(Date.now());
        }
        if (sessionStorage.getItem('warehouse')) {
            this.warehouse = Number(sessionStorage.getItem('warehouse'));
        }
        if (sessionStorage.getItem('company')) {
            this.company = Number(sessionStorage.getItem('company'));
        }
    }
    set(uid, pass) {
        Logger.LogInfo('[PERMISSIONS] user Uid:', uid);
        this.uid = uid;
        this.pass = pass;
        sessionStorage.setItem('token', [this.uid, this.pass].join(this._sep));
        this.guards = {};
        this._updated$.next(Date.now());
    }
    setWarehouse(warehouse) {
        this.warehouse = warehouse;
        sessionStorage.setItem('warehouse', this.warehouse?.toString() || '');
    }
    setCompany(company) {
        this.company = company;
        sessionStorage.setItem('company', this.company?.toString() || '');
    }
    setEmployee(employee) {
        this.employee = employee;
    }
    setRole(role) {
        this.roles = [role];
        if (role === 'admin') {
            this.guards = {
                all: ['all'],
                admin: ['all'],
                interne: ['all'],
                shared: ['all'],
            };
        }
        else if (role === 'interne') {
            this.guards = {
                all: ['all'],
                interne: ['all'],
                shared: ['all'],
            };
        }
        else if (role === 'shared') {
            this.guards = {
                all: ['read'],
                shared: ['all'],
            };
        }
    }
    reset() {
        this.uid = null;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('warehouse');
        sessionStorage.removeItem('company');
        this.guards = {};
        this._updated$.next(Date.now());
    }
    hasRole(role) {
        return this.roles.some(x => x === role);
    }
    canDirectAccess(feature, level) {
        if (level === 'unauthenticated') {
            return !this.isAuthenticated;
        }
        if (level === 'authenticated') {
            return this.isAuthenticated;
        }
        if (!feature) {
            return true;
        }
        const featureGuard = this.guards[feature];
        if (!featureGuard) {
            return false;
        }
        if (featureGuard.includes('all')) {
            return true;
        }
        if (!featureGuard.includes(level)) {
            return false;
        }
        return true;
    }
    canAccess(feature, level) {
        if (this.received)
            return of(this.canDirectAccess(feature, level));
        return this._updated$.pipe(map$1(() => this.canDirectAccess(feature, level)));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydPermissionsServices, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydPermissionsServices, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BydPermissionsServices, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });

class BearerInterceptor {
    _permissionsServices = inject(BydPermissionsServices);
    constructor() {
        console.log('BearerInterceptor');
    }
    intercept(req, next) {
        if (this._permissionsServices.token) {
            const bearerHeader = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this._permissionsServices.token),
            });
            return next.handle(bearerHeader);
        }
        return next.handle(req);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BearerInterceptor, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BearerInterceptor });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "19.2.15", ngImport: i0, type: BearerInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [] });

const provideServer = (data) => [
    importProvidersFrom(ApolloModule),
    {
        provide: HTTP_INTERCEPTORS,
        useClass: BearerInterceptor,
        multi: true,
    },
    {
        provide: GRAPHQL_SERVER_CONFIG,
        useValue: data.graphQlConfig,
    },
    {
        provide: SERVER_CONFIG_KEY,
        useValue: data.httpConfig,
    },
];

/*
 * Public API Surface of server
 */

/**
 * Generated bundle index. Do not edit.
 */

export { BydBaseService, BydGraphService, BydPermissionsServices, BydServerSevice, CacheInterceptor, GRAPHQL_CONFIG_TOKEN, GRAPHQL_SERVER_CONFIG, GraphSchema, HandleComplexRequest, HandleSimpleRequest, Logger, Request, RequestMap, SERVER_CONFIG_KEY, StatusReponse, graphQlBydke, graphQlPaginationFields, graphQlUpdateFields, keyValueProps, provideServer };
//# sourceMappingURL=beyond-server.mjs.map
