import { CacheStrategy } from '../../types/cache';
/**
 *
 * @param type
 * @param content
 * @param cacheTime in minutes => -1 = inifity, 0 = no cache (default), x = number of cache in minutes | ByDefault 0
 * @param loginRequired
 */
type RequestOptions = {
    type: string;
    content?: any;
    urlData?: any;
    cacheTime?: CacheStrategy;
    loginRequired?: boolean;
};
export declare class Request {
    id: number;
    type: string;
    loginRequired: boolean;
    cacheTime: CacheStrategy;
    urlData: any;
    private readonly _content;
    get Content(): string;
    get BrutContent(): any;
    constructor({ type, content, urlData, cacheTime, loginRequired, }: RequestOptions);
}
export {};
