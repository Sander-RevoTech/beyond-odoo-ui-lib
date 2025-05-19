import { OnInit, TemplateRef } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class SwiperLightComponent extends BydBaseComponent implements OnInit {
    items: {
        key: string;
    }[];
    template: TemplateRef<any>;
    swiperClasses: string;
    containerClasses?: string;
    forced?: boolean;
    classes: string;
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwiperLightComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SwiperLightComponent, "byd-swiper-light", never, { "items": { "alias": "items"; "required": false; }; "template": { "alias": "template"; "required": false; }; "swiperClasses": { "alias": "swiperClasses"; "required": false; }; "containerClasses": { "alias": "containerClasses"; "required": false; }; "forced": { "alias": "forced"; "required": false; }; }, {}, never, never, true, never>;
}
