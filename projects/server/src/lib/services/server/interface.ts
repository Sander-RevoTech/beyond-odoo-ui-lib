import { Subject } from 'rxjs';

import { Request } from './request';

export interface TempRequest {
  subject: Subject<Object>;
  request: Request;
}
export interface Subs {
  key: string;
  subNumber: number;
  subModel: any;
}
export interface Correlation {
  id: number;
  request: Request;
  subject: Subject<Object>;
}

export interface TenantConfig {
  tenantId: number | null;
}
