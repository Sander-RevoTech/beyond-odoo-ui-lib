import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable, InjectionToken, Optional } from '@angular/core';

import { Subject } from 'rxjs';

import { Logger } from '../../logger';
import { Correlation, TempRequest } from '../interface';
import { Request } from '../request';
import { IBackResponse, IBaseResponse, IResponse, StatusReponse } from '../response';
import { MappingApiType, RequestMap } from './requestMap';
import { Permissions } from '../../user/permissions';

export const SERVER_CONFIG_KEY = new InjectionToken<IServerConfig>('config_server');
export interface IServerConfig {
  pendindRequestId: number;
  serverUrl: string;
  apiExt?: string;
}
@Injectable({
  providedIn: 'root',
})
export class TaServerSevice {
  private readonly _config = inject(SERVER_CONFIG_KEY)

  readonly $http = inject(HttpClient);

  get requestInProgressNumber(): number {
    return this._correlations.length;
  }

  private _tempLoginRequiredRequest: TempRequest[] = [];
  private _tempPendingRequest: TempRequest[] = [];

  private _correlations: Correlation[] = [];

  private _isAuthenticated = false;
  get isAuthenticated() {
    return this._isAuthenticated;
  }
  set isAuthenticated(value: boolean) {
    this._isAuthenticated = value;
    if (this._isAuthenticated) {
      this._retryLoginRequired();
    }
  }

  constructor() {}

  public registerRoutes(routes: MappingApiType) {
    RequestMap.register(routes);
  }

  public request<T>(request: Request): Subject<T> {
    const subject = new Subject<Object>();
    this._send(subject, request);
    return subject as unknown as Subject<T>;
  }
  public retryRequest(list: TempRequest[] = []) {
    for (const request of list) {
      this._send(request.subject, request.request);
    }
  }
  private _send(subject: Subject<Object>, request: Request) {
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
  private _sendRequest(request: Request) {
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
  private _onPacketReceived = (id: number, response: IResponse): void => {
    Logger.LogInfo('[SERVER] Api Reponse:', response);

    this._resolveCorrelation(id, response.body);
  };
  private _addCorrelation(corrId: number, request: Request, sub: Subject<Object>) {
    this._correlations.push({ id: corrId, request: request, subject: sub });
  }
  private _resolveCorrelation = (corrId: number, body: string | Object) => {
    const correlation = this._correlations.find(item => item.id === corrId);

    if (!correlation) {
      return;
    }
    let content;
    if (typeof body === 'string') {
      try {
        content = JSON.parse(<string>body);
      } catch (error) {
        content = body;
      }
    } else {
      content = body;
    }
    this._resolveResponseStatus(correlation, content);

    this._correlations = this._correlations.filter(item => item !== correlation);
    if (this.requestInProgressNumber === 0) {
      this._retryPending();
    }
  };
  private _resolveResponseStatus(correlation: Correlation, content: IBaseResponse) {
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

  private _retryPending() {
    const list = [...this._tempPendingRequest];
    this._tempPendingRequest = [];

    this.retryRequest(list);
  }

  private _retryLoginRequired() {
    const list = [...this._tempLoginRequiredRequest];
    this._tempLoginRequiredRequest = [];

    this.retryRequest(list);
  }

  private _get(url: string, request: Request) {
    this.$http
      .get<IBackResponse>(url, {
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
  private _post(url: string, request: Request) {
    this.$http
      .post<IBackResponse>(url, request.BrutContent, {
        headers: this._headers(),
      })
      .subscribe({
        next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
        error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
        complete: () => Logger.LogDebug('API POST CLOSE'),
      });
  }
  private _patch(url: string, request: Request) {
    this.$http.patch<IBackResponse>(url, request.Content, { headers: this._headers() }).subscribe({
      next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
      error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
      complete: () => Logger.LogDebug('API PATCH CLOSE'),
    });
  }
  private _put(url: string, request: Request) {
    this.$http.put<IBackResponse>(url, request.Content, { headers: this._headers() }).subscribe({
      next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
      error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
      complete: () => Logger.LogDebug('API PUT CLOSE'),
    });
  }
  private _delete(url: string, request: Request) {
    this.$http.delete<IBackResponse>(url, { headers: this._headers() }).subscribe({
      next: response => this._onPacketReceived(request.id, this._formatReponse(response)),
      error: message => this._onPacketReceived(request.id, this._formatReponse(message, message.status)),
      complete: () => Logger.LogDebug('API DELETE CLOSE'),
    });
  }
  private _files(url: string, request: Request) {
    this.$http
      .post<IBackResponse>(url, request.BrutContent.files, {
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
  private _updateFiles(url: string, request: Request) {
    this.$http
      .put<IBackResponse>(url, request.BrutContent.files, {
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
  private _formatReponse(response: object, status: number = 200): IResponse {
    return { body: { Status: status, Content: response } };
  }
  private _headers(option?: { contentType?: string }): HttpHeaders {
    let headers = new HttpHeaders();

    if (option?.contentType !== '') {
      headers = headers.set('Content-Type', option?.contentType ? option?.contentType : 'application/json');
    }
    headers = headers.set('Access-Control-Allow-Origin', this._config?.serverUrl ?? '');

    Logger.LogInfo('[SERVER] Api Request Header:', headers);

    return headers;
  }
}
