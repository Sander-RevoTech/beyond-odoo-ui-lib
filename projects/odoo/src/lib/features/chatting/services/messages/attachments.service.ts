import { Injectable } from '@angular/core';

import { HandleComplexRequest } from '@beyond/server';
import { FileStructure, getBase64FromFile } from '@beyond/utils';
import { filter, forkJoin, of } from 'rxjs';

import { BydBaseOdooService } from '../../../../services/baseService';
import { Attachment } from './dto/attachment';

@Injectable({
  providedIn: 'root',
})
export class BydAttachementsService extends BydBaseOdooService {
  public readonly attachmentsByIds = new HandleComplexRequest<Attachment[]>();
  public readonly attachments = new HandleComplexRequest<Attachment[]>();

  constructor() {
    super();
  }

  public keyByIds(ids: number[]) {
    return ids.join('-');
  }
  public key(id: number, model: string) {
    return `${id}-${model}`;
  }

  public fetchByIds$(ids: number[]) {
    return this.attachments.fetch(
      this.keyByIds(ids),
      this._odooService
        .searchRead$<Attachment>('ir.attachment', [['id', 'in', ids]], ['id', 'datas'])
        .pipe(filter(data => !!data))
    );
  }
  public fetch$(id: number, model: string) {
    return this.attachments.fetch(
      this.key(id, model),
      this._odooService
        .searchRead$<Attachment>(
          'ir.attachment',
          [
            ['res_id', '=', id],
            ['res_model', '=', model],
          ],
          ['id', 'datas']
        )
        .pipe(filter(data => !!data))
    );
  }
  public async post$(id: number, model: string, files: FileStructure[]) {
    const attachments: any[] = [];

    for (let file of files.filter(att => att.file)) {
      if (!file.file) {
        continue;
      }
      const base64 = (await getBase64FromFile(file.file)).split(',')[1];
      attachments.push({ name: 'attachments-by-app-' + id, datas: base64, res_model: model });
    }

    return attachments.length > 0
      ? forkJoin([
          ...attachments.map(attachment =>
            this._odooService.create$<number>('ir.attachment', { ...attachment, ...{ res_id: id } })
          ),
        ])
      : of([]);
  }
}
