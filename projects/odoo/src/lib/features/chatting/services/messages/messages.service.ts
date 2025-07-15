import { Injectable, inject } from '@angular/core';

import { FileStructure, getBase64FromFile } from '@beyond/utils';
import { BehaviorSubject, filter, forkJoin, map, merge, mergeMap, of, tap } from 'rxjs';

import { BydBaseOdooService } from '../../../../services/baseService';
import { BydAttachementsService } from './attachments.service';
import { Message } from './dto/message';

@Injectable({
  providedIn: 'root',
})
export class BydMessagesService extends BydBaseOdooService {
  public messages$ = new BehaviorSubject<{ [id: number]: Message[] }>({});

  private readonly _attachmentsService = inject(BydAttachementsService);

  constructor() {
    super();
  }

  public getMessages$(id: number) {
    return this.messages$.pipe(map(data => data[id]));
  }

  public fetchMessage$(data: { res_id: number; model: string; message_type: string }) {
    return this._odooService
      .searchRead$<Message>(
        'mail.message',
        [
          ['res_id', '=', data.res_id],
          ['model', 'like', data.model],
          ['message_type', 'like', data.message_type],
        ],
        ['body', 'attachment_ids']
      )
      .pipe(
        filter(data => !!data),
        tap(list => {
          const entities = this.messages$.getValue();
          entities[data.res_id] = list;
          this.messages$.next(entities);
        })
      );
  }

  public async postMessage$(id: number, message: Message, files: FileStructure[]) {
    const attachments: any[] = [];

    for (let file of files.filter(att => att.file)) {
      if (!file.file) {
        continue;
      }
      const base64 = (await getBase64FromFile(file.file)).split(',')[1];
      attachments.push({ name: 'attachments-by-app-' + id, datas: base64, res_model: message.model });
    }

    return (files.length > 0 ? await this._attachmentsService.post$(id, message.model, files) : of([])).pipe(
      mergeMap((ids: number[]) => {
        return this._odooService.create$<number>('mail.message', {
          ...message,
          ...{ subtype_id: 2, attachment_ids: ids },
        });
      })
    );
  }
}
