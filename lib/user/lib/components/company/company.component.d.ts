import { MatDialogRef } from '@angular/material/dialog';
import { BydAbstractComponent } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class CompanyComponent extends BydAbstractComponent {
    private readonly _usersServices;
    private readonly _companiesServices;
    dialogRef: MatDialogRef<any, any>;
    companies$: import("rxjs").Observable<import("@beyond/odoo").Company[] | null>;
    constructor();
    select(id: number): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CompanyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CompanyComponent, "byd-company", never, {}, {}, never, never, true, never>;
}
