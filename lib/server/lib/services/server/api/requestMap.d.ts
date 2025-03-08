import { Request } from '../request';
export interface IRequestMap {
    type: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'FILES' | 'UPDATEFILES';
    url: string;
}
export type MappingApiType = {
    [index: string]: IRequestMap;
};
declare class RequestMapCore {
    mappingApi: MappingApiType;
    register(routes: MappingApiType): void;
    getConfigById(id: string): IRequestMap | null;
    parseUrl(data: {
        serverUrl: string;
        url: string;
        request: Request;
        apiExt?: string;
    }): string;
    private _getConfigById;
    private _formatUrl;
}
export declare const RequestMap: RequestMapCore;
export {};
