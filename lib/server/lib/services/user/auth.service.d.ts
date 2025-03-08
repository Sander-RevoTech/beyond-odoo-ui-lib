import { BydStrapiService } from '../strapi/strapi.service';
import * as i0 from "@angular/core";
export declare class BydAuthService extends BydStrapiService {
    constructor();
    login(data: {
        identifier: string;
        password: string;
    }): import("rxjs").Subscription;
    logout(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydAuthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydAuthService>;
}
