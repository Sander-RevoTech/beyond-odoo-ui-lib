import { EventEmitter } from '@angular/core';
import { FileStructure } from '@beyond/utils';
import * as i0 from "@angular/core";
export interface ActionButtonData {
    callback: (data?: any) => void;
    icon: string;
    label: string;
}
export type Feature = 'take-pic' | 'upload-pic' | 'upload-file';
export declare class BydUploadComponent {
    features: Feature[];
    canSelectMultipleFiles: boolean;
    filesPicked: EventEmitter<FileStructure[]>;
    tempImages: import("@angular/core").WritableSignal<FileStructure[]>;
    get addActions(): ActionButtonData[];
    constructor();
    addImage(images: FileStructure[]): void;
    remove(pic: FileStructure): void;
    private _haveFeature;
    private _takePic;
    private _uploadPic;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydUploadComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydUploadComponent, "byd-files-upload", never, { "features": { "alias": "features"; "required": false; }; "canSelectMultipleFiles": { "alias": "canSelectMultipleFiles"; "required": false; }; }, { "filesPicked": "filesPicked"; }, never, never, true, never>;
}
