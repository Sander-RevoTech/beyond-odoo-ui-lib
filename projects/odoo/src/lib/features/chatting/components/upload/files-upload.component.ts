import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent } from '@beyond/ui';
import { FileStructure, picImages, takeImage } from '@beyond/utils';


export interface ActionButtonData {
  callback: (data?: any) => void;
  icon: string;
  label: string;
}
export type Feature = 'take-pic' | 'upload-pic' | 'upload-file';

@Component({
  selector: 'byd-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss'],
  standalone: true,
  imports: [BydButtonComponent, MatIcon, TranslatePipe],
})
export class BydUploadComponent {
  @Input()
  features: Feature[] = [];

  @Input()
  canSelectMultipleFiles: boolean = false;

  @Output()
  filesPicked = new EventEmitter<FileStructure[]>();

  get addActions(): ActionButtonData[] {
    const actionsAvailable: ActionButtonData[] = [];

    if (this._haveFeature('take-pic')) {
      actionsAvailable.push({
        label: 'add picture',
        icon: 'add_a_photo',
        callback: () => this._takePic(),
      });
    }

    if (this._haveFeature('upload-pic')) {
      actionsAvailable.push({
        label: 'Upload',
        icon: 'insert_photo',
        callback: () => this._uploadPic(),
      });
    }

    // if (this._haveFeature('upload-file')) {
    //   actionsAvailable.push({
    //     label: 'upload file',
    //     icon: 'upload_file',
    //     callback: () => this._uploadFile(),
    //   });
    // }

    return actionsAvailable;
  }

  private _haveFeature(feature: Feature) {
    return this.features.includes(feature);
  }

  private async _takePic() {
    const file = await takeImage();
    if (!file) {
      return;
    }
    this.filesPicked.emit([file]);
  }

  private async _uploadPic() {
    const pics = await picImages();
    this.filesPicked.emit(pics);
  }

  // private async _uploadFile() {
  //   // todo move into a capacitor filesystem service
  //   const pickFiles = await FilePicker.pickFiles({
  //     multiple: this.canSelectMultipleFiles,
  //     types: [
  //       // pdf
  //       'application/pdf',
  //       // word
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //       'application/msword',
  //       // excel
  //       'application/vnd.ms-excel',
  //       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //       // text
  //       'text/plain',
  //     ],
  //   });

  //   const files = [];
  //   for (let file of pickFiles.files) {
  //     if (!file || !file.blob) continue;

  //     files.push({ file: this._localToFile(file), localUrl: null });
  //   }

  //   this.filesPicked.emit(files);
  // }

  // private _localToFile(file: PickedFile): File {
  //   return new File([file.blob!], file.name, {
  //     type: file.mimeType,
  //   });
  // }
}
