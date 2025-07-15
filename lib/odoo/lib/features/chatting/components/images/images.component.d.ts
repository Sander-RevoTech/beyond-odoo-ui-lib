import { OnInit } from '@angular/core';
import { BydBaseComponent } from '@beyond/utils';
import { Observable } from 'rxjs';
import { Attachment } from '../../services/messages/dto/attachment';
import * as i0 from "@angular/core";
export declare class BydImagesComponent extends BydBaseComponent implements OnInit {
    ids: number[];
    private readonly _attachementsService;
    images: import("@angular/core").WritableSignal<Observable<Attachment[]> | null>;
    constructor();
    ngOnInit(): void;
    private _fetch;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydImagesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydImagesComponent, "byd-images", never, { "ids": { "alias": "ids"; "required": false; }; }, {}, never, never, true, never>;
}
