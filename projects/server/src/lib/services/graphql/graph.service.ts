import { Inject, Injectable, Optional, inject } from '@angular/core';

import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { BehaviorSubject, filter, map, switchMap, take, tap } from 'rxjs';

import { isURL } from '@beyond/utils';

import { Logger } from '../logger';
import { GraphMutationPayload, GraphQueryPayload } from './models/graphPayload';
import { GraphReponseData } from './models/graphResponseData';
import { GraphReponsePagedData } from './models/graphResponsePagedData';
import { ReponseMutationData } from './models/responseData';
import { GRAPHQL_SERVER_CONFIG, GraphEndpoint } from './public-api';

type WrapperData = {
  context?: string;
};
@Injectable({
  providedIn: 'root',
})
export class TaGraphService {
  private readonly _graphConfig = inject(GRAPHQL_SERVER_CONFIG);

  public contactsLoaded$ = new BehaviorSubject<boolean>(false);
  public isReady$ = new BehaviorSubject<boolean>(true);

  private _defaultEndpoint;
  private _cache;
  constructor(
    private httpLink: HttpLink,
    private apollo: Apollo
  ) {
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

  public clearCache(key: string) {
    this._cache.evict({
      fieldName: key,
    });
  }

  public fetchQueryList<T>(payload: GraphQueryPayload, node: string, context: string) {
    return this._getWrapper({ context }).pipe(
      tap(() => Logger.LogInfo('[GraphQL] [Query] fetchQueryList:', { payload, node, context })),
      switchMap(() =>
        this.apollo.query<GraphReponseData<T[]>>(this._setupData(payload, context)).pipe(
          tap(data => Logger.LogInfo('[GraphQL] [Response] fetchQueryList:', { data, node, context })),
          filter(response => !!response.data),
          map(response => response.data[node])
        )
      ),
      take(1)
    );
  }

  public fetchPagedQueryList<T>(payload: GraphQueryPayload, node: string, context: string) {
    Logger.LogInfo('[GraphQL] [Prepare] fetchPagedQueryList:', { payload, node, context });
    return this._getWrapper({ context }).pipe(
      tap(() => Logger.LogInfo('[GraphQL] [Query] fetchPagedQueryList:', { payload, node, context })),
      switchMap(() =>
        this.apollo.query<GraphReponsePagedData<T>>(this._setupData(payload, context)).pipe(
          tap(data => Logger.LogInfo('[GraphQL] [Response] fetchPagedQueryList:', { data, node, context })),
          filter(response => !!response.data),
          map(response => response.data[node])
        )
      ),
      take(1)
    );
  }

  public fetchQuery<T>(payload: GraphQueryPayload, node: string, context: string) {
    return this._getWrapper({ context }).pipe(
      tap(() => Logger.LogInfo('[GraphQL] [Query] fetchQuery:', { payload, node, context })),
      switchMap(() =>
        this.apollo.query<GraphReponseData<T>>(this._setupData(payload, context)).pipe(
          tap(data => Logger.LogInfo('[GraphQL] [Response] fetchQuery:', { data, node, context })),
          filter(response => !!response.data),
          map(data => data.data[node])
        )
      ),
      take(1)
    );
  }

  public mutate<T>(payload: GraphMutationPayload, mutationName: string, context: string, clearCache?: string[]) {
    Logger.LogInfo('[GraphQL]  [Prepare] mutate', payload, mutationName);
    return this.apollo.mutate<ReponseMutationData<T>>(this._setupData(payload, context)).pipe(
      tap(data => Logger.LogInfo('[GraphQL] [Reponse] mutate', data)),
      filter(response => !!response.data),
      tap(() => clearCache?.forEach(cacheKey => this.clearCache(cacheKey))),
      map(response => {
        return response!.data![mutationName];
      })
    );
  }

  public registerGraphEndpoint(graphEndpoint: GraphEndpoint) {
    let uri = isURL(graphEndpoint.endpoint)
      ? graphEndpoint.endpoint
      : this._graphConfig.url + graphEndpoint.endpoint;

    const newHttpLink = this.httpLink.create({
      headers: graphEndpoint.headers,
      uri: uri,
    });

    this.apollo.client.setLink(
      this.apollo.client.link.concat(
        ApolloLink.split(operation => operation.getContext()['clientName'] === graphEndpoint.clientName, newHttpLink)
      )
    );
  }

  private _setupData<T>(payload: T, context: string) {
    return { ...payload, ...{ context: { clientName: context } } };
  }

  private _getWrapper(data?: WrapperData) {
    return this.isReady$;
  }
}
