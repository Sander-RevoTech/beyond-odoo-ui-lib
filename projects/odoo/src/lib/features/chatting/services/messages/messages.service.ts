import { Injectable } from '@angular/core';

import { BehaviorSubject, filter, forkJoin, map, merge, mergeMap, tap } from 'rxjs';


import { Message } from './dto/message';
import { BydBaseOdooService } from '../../../../services/baseService';
import { FileStructure, getBase64FromFile } from '@beyond/utils';

@Injectable({
  providedIn: 'root',
})
export class AppMessagesService extends BydBaseOdooService {
  public messages$ = new BehaviorSubject<{ [id: number]: Message[] }>({});

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
        ['body', 'attachment_ids'],
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
      const base64 = file.file ? await getBase64FromFile(file.file) : null;
      attachments.push({ name: file.localUrl, datas: base64, filetype: 'jpeg', res_model: "mail.message", });
    }

    return this._odooService.create$<Message>('mail.message', { ...message, ...{ subtype_id: 2}})
    .pipe(
      filter(data => !!data),
      mergeMap(data => forkJoin([...attachments.map(attachment =>
        this._odooService.create$<unknown>('ir.attachment', { ...attachment, ...{ res_id: data.id } })
      )]),
      ));
  }
}
