interface IHeaders {
  destination: string;
}

export interface IBackResponse {
  data: object;
}
export interface IResponse {
  body: string | IBaseResponse;
  headers?: IHeaders;
}
export enum StatusReponse {
  Unknown = 0,
  Successful = 200,
  NoContent = 204,
  Unauthorized = 401,
  Forbidden = 403,
  Error = 500,
}
export interface IBaseResponse {
  Status: StatusReponse;
  Content: Object;
}
export interface IGetTokenResponse extends IBaseResponse {
  token: string;
}
