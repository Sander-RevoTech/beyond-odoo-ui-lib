import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TypedTemplateDirective<TypeToken> {
    private contentTemplate;
    typedTemplate: TypeToken;
    constructor(contentTemplate: TemplateRef<TypeToken>);
    static ngTemplateContextGuard<TypeToken>(dir: TypedTemplateDirective<TypeToken>, ctx: unknown): ctx is TypeToken;
    static ɵfac: i0.ɵɵFactoryDeclaration<TypedTemplateDirective<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TypedTemplateDirective<any>, "ng-template[typedTemplate]", never, { "typedTemplate": { "alias": "typedTemplate"; "required": false; }; }, {}, never, never, true, never>;
}
