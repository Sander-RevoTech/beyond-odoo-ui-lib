import { BehaviorSubject } from 'rxjs';
import { Message } from './dto/message';
import { BydBaseOdooService } from '../../../../services/baseService';
import { FileStructure } from '@beyond/utils';
import * as i0 from "@angular/core";
export declare class AppMessagesService extends BydBaseOdooService {
    messages$: BehaviorSubject<{
        [id: number]: Message[];
    }>;
    constructor();
    getMessages$(id: number): import("rxjs").Observable<Message[]>;
    fetchMessage$(data: {
        res_id: number;
        model: string;
        message_type: string;
    }): import("rxjs").Observable<Message[]>;
    postMessage$(id: number, message: Message, files: FileStructure[]): Promise<import("rxjs").Observable<unknown[]>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppMessagesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppMessagesService>;
}
