import { OnInit } from '@angular/core';
import { InputTextBox } from '@beyond/form-model';
import { BydBaseComponent, FileStructure } from '@beyond/utils';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
export declare class BydMessagesComponent extends BydBaseComponent implements OnInit {
    id: number;
    model: string;
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    readonly clearImage$: Subject<unknown>;
    private readonly _messagesService;
    input: InputTextBox<string>;
    images: import("@angular/core").WritableSignal<FileStructure[]>;
    get disable(): boolean;
    get data$(): import("rxjs").Observable<import("../../services/messages/dto/message").Message[]>;
    constructor();
    ngOnInit(): void;
    getPicUrl(id: number): string;
    send(): Promise<void>;
    private _fetch;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydMessagesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydMessagesComponent, "byd-messages", never, { "id": { "alias": "id"; "required": false; }; "model": { "alias": "model"; "required": false; }; }, {}, never, never, true, never>;
}
