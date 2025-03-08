import { Placeholder, PlaceholderConfig } from '../placeholder/config';
import * as i0 from "@angular/core";
export declare class LoaderComponent {
    isLoading: boolean;
    skeleton: PlaceholderConfig | null;
    constructor();
    getPlaceholder(): Placeholder;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoaderComponent, "byd-loader", never, { "isLoading": { "alias": "isLoading"; "required": false; }; "skeleton": { "alias": "skeleton"; "required": false; }; }, {}, never, ["*"], true, never>;
}
