import { FileStructure } from '@beyond/utils';
import { BehaviorSubject } from 'rxjs';
import { BydBaseOdooService } from '../../../../services/baseService';
import { Message } from './dto/message';
import * as i0 from "@angular/core";
export declare class BydMessagesService extends BydBaseOdooService {
    messages$: BehaviorSubject<{
        [id: number]: Message[];
    }>;
    private readonly _attachmentsService;
    constructor();
    getMessages$(id: number): import("rxjs").Observable<Message[]>;
    fetchMessage$(data: {
        res_id: number;
        model: string;
        message_type: string;
    }): import("rxjs").Observable<Message[]>;
    postMessage$(id: number, message: Message, files: FileStructure[]): Promise<import("rxjs").Observable<number>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<BydMessagesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BydMessagesService>;
}
