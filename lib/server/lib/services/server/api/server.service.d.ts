import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { TempRequest } from '../interface';
import { Request } from '../request';
import { MappingApiType } from './requestMap';
import * as i0 from "@angular/core";
export declare const SERVER_CONFIG_KEY: InjectionToken<IServerConfig>;
export interface IServerConfig {
    pendindRequestId: number;
    serverUrl: string;
    apiExt?: string;
}
export declare class TaServerSevice {
    private readonly _config;
    readonly $http: HttpClient;
    get requestInProgressNumber(): number;
    private _tempLoginRequiredRequest;
    private _tempPendingRequest;
    private _correlations;
    private _isAuthenticated;
    get isAuthenticated(): boolean;
    set isAuthenticated(value: boolean);
    constructor();
    registerRoutes(routes: MappingApiType): void;
    request<T>(request: Request): Subject<T>;
    retryRequest(list?: TempRequest[]): void;
    private _send;
    private _sendRequest;
    private _onPacketReceived;
    private _addCorrelation;
    private _resolveCorrelation;
    private _resolveResponseStatus;
    private _retryPending;
    private _retryLoginRequired;
    private _get;
    private _post;
    private _patch;
    private _put;
    private _delete;
    private _files;
    private _updateFiles;
    private _formatReponse;
    private _headers;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaServerSevice, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaServerSevice>;
}
