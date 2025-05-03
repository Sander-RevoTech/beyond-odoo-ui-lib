import { OnInit } from '@angular/core';
import { AppMessagesService } from '../../services/messages/messages.service';
import { BydBaseComponent, FileStructure } from '@beyond/utils';
import { InputTextBox } from '@beyond/form-model';
import * as i0 from "@angular/core";
export declare class BydMessagesComponent extends BydBaseComponent implements OnInit {
    private _messagesService;
    id: number;
    model: string;
    readonly server: import("@beyond/odoo").IOdooServerConfig;
    input: InputTextBox<string>;
    images: import("@angular/core").WritableSignal<FileStructure[]>;
    get disable(): boolean;
    get data$(): import("rxjs").Observable<import("../../services/messages/dto/message").Message[]>;
    constructor(_messagesService: AppMessagesService);
    ngOnInit(): void;
    getPicUrl(id: number): string;
    send(): Promise<void>;
    private _fetch;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydMessagesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BydMessagesComponent, "byd-messages", never, { "id": { "alias": "id"; "required": false; }; "model": { "alias": "model"; "required": false; }; }, {}, never, never, true, never>;
}
