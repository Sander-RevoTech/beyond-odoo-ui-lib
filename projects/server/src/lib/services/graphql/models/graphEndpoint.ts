import { HttpHeaders } from '@angular/common/http';

export interface GraphEndpoint {
  clientName: string;
  endpoint: string;
  headers?: HttpHeaders;
}
