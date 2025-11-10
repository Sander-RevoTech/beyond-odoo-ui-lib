import { MatDialogRef } from '@angular/material/dialog';
import { FileStructure } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class BydUploadAnnotationDialog {
    dialogRef: MatDialogRef<any, any>;
    data: FileStructure;
    constructor();
    savedImage(blob: Blob): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydUploadAnnotationDialog, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydUploadAnnotationDialog, "ng-component", never, {}, {}, never, never, true, never>;
}
