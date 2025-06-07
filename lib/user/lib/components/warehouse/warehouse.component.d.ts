import { MatDialogRef } from '@angular/material/dialog';
import { BydAbstractComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class WarehouseComponent extends BydAbstractComponent {
    private readonly _usersServices;
    private readonly _warehouseServices;
    dialogRef: MatDialogRef<any, any>;
    warehouses$: import("rxjs").Observable<import("../../../../../../lib/odoo/lib/services/warehouses/dto/warehouse").Warehouse[] | null>;
    constructor();
    select(id: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<WarehouseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<WarehouseComponent, "byd-warehouse", never, {}, {}, never, never, true, never>;
}
