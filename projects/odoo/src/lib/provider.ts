
import { Provider } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TargetUrlInterceptor } from "./interceptor/TargetUrlInterceptor";

export const provideOdoo = (): Provider => [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TargetUrlInterceptor,
      multi: true
    },
  ]
