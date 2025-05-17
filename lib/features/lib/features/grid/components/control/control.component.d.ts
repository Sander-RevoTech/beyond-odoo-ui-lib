import { OnInit } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { ViewType } from '../../models/types';
import * as i0 from "@angular/core";
export declare class GridControlComponent extends BydAbstractGridComponent<any> implements OnInit {
    show: {
        switchView?: boolean;
    };
    constructor();
    ngOnInit(): void;
    switchView(type: ViewType): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GridControlComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GridControlComponent, "byd-grid-control", never, { "show": { "alias": "show"; "required": false; }; }, {}, never, never, true, never>;
}
