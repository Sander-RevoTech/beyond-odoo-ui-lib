import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export declare class BydNavigationDateWeekComponent {
    viewDate: Date;
    viewDateChanged: EventEmitter<Date>;
    get fromDay(): Date;
    get toDay(): Date;
    get weekInYear(): number;
    previous(): void;
    next(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydNavigationDateWeekComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydNavigationDateWeekComponent, "byd-navigation-date-week", never, { "viewDate": { "alias": "viewDate"; "required": false; }; }, { "viewDateChanged": "viewDateChanged"; }, never, never, true, never>;
}
