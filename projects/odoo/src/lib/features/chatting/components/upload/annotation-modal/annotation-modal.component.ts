import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { FilesAnnotationComponent } from '@beyond/files';
import { FileStructure, getBase64FromFile } from '@beyond/utils';

@Component({
  selector: '',
  templateUrl: './annotation-modal.component.html',
  standalone: true,
  imports: [FilesAnnotationComponent, MatIcon, MatDialogClose],
})
export class BydUploadAnnotationDialog {
  public dialogRef = inject(MatDialogRef<BydUploadAnnotationDialog>);
  public data: FileStructure = inject(MAT_DIALOG_DATA);

  constructor() {
    this.dialogRef.addPanelClass('full-modal');
  }

  public async savedImage(blob: Blob) {
    const file = new File([blob], this.data.file?.name ?? 'annotation', { type: blob.type });
    this.dialogRef.close({ file: { file, localUrl: await getBase64FromFile(file) } });
  }
}
