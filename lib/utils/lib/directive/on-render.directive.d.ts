import { EventEmitter, SimpleChanges } from '@angular/core';
import * as i0 from "@angular/core";
export declare class OnRenderDirective {
    onRender: boolean;
    rendered: EventEmitter<any>;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OnRenderDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<OnRenderDirective, "[taOnRender]", never, { "onRender": { "alias": "onRender"; "required": false; }; }, { "rendered": "rendered"; }, never, never, true, never>;
}
