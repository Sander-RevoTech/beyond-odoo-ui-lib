import { TaStrapiService } from '../strapi/strapi.service';
import * as i0 from "@angular/core";
export declare class TaAuthService extends TaStrapiService {
    constructor();
    login(data: {
        identifier: string;
        password: string;
    }): import("rxjs").Subscription;
    logout(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaAuthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaAuthService>;
}
