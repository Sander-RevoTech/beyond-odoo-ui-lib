import { Component, EventEmitter, Input, OnInit, Output, computed, effect, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent, FileStructure, picImages, takeImage } from '@beyond/utils';
import { Observable } from 'rxjs';

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
  imports: [BydButtonComponent, MatIcon, TranslatePipe, LoaderComponent],
})
export class BydUploadComponent extends BydBaseComponent implements OnInit {
  @Input()
  features: Feature[] = [];

  @Input()
  canSelectMultipleFiles: boolean = false;

  @Input()
  clear$: Observable<unknown> | null = null;

  @Output()
  filesPicked = new EventEmitter<FileStructure[]>();

  public tempImages = signal<FileStructure[]>([]);

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

  constructor() {
    super();
    effect(() => {
      this.filesPicked.emit(this.tempImages());
    });
  }

  ngOnInit() {
    if (this.clear$) {
      this._registerSubscription(
        this.clear$.subscribe(() => {
          this.tempImages.set([]);
        })
      );
    }
  }

  public addImage(images: FileStructure[]) {
    this.tempImages.set([...this.tempImages(), ...images]);
  }
  public remove(pic: FileStructure) {
    this.tempImages.set(this.tempImages().filter(item => item.localUrl !== pic.localUrl));
  }

  private _haveFeature(feature: Feature) {
    return this.features.includes(feature);
  }

  private async _takePic() {
    this.requestState.asked();
    const file = await takeImage();
    if (!file) {
      return;
    }
    this.addImage([file]);
    this.requestState.completed();
  }

  private async _uploadPic() {
    this.requestState.asked();

    const pics = await picImages();
    this.addImage(pics);
    this.requestState.completed();
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
