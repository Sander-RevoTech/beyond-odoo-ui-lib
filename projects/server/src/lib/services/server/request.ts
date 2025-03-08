import { newId } from '@beyond/utils';

import { CacheStrategy, ECacheStrategy } from '../../types/cache';

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
export class Request {
  public id: number;

  public type: string;
  public loginRequired: boolean;
  public cacheTime: CacheStrategy;
  public urlData: any;

  private readonly _content: any;

  get Content(): string {
    return JSON.stringify(this._content);
  }
  get BrutContent(): any {
    return this._content;
  }

  constructor({
    type,
    content = null,
    urlData = null,
    cacheTime = ECacheStrategy.NoCache,
    loginRequired = true,
  }: RequestOptions) {
    this.id = newId();
    this.type = type;
    this.loginRequired = loginRequired;
    this.cacheTime = cacheTime;
    this.urlData = urlData;

    this._content = content;
  }
}
