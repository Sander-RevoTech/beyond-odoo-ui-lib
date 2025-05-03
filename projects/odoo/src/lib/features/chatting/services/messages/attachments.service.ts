import { Injectable } from '@angular/core';

import { forkJoin, of } from 'rxjs';

import { BydBaseOdooService } from '../../../../services/baseService';
import { FileStructure, getBase64FromFile } from '@beyond/utils';

@Injectable({
  providedIn: 'root',
})
export class BydAttachementsService extends BydBaseOdooService {

  constructor() {
    super();
  }

  public async post$(id: number, model: string, files: FileStructure[]) {
    const attachments: any[] = [];

    for (let file of files.filter(att => att.file)) {
      if(!file.file) {
        continue;
      }
      const base64 = (await getBase64FromFile(file.file)).split(',')[1];
      attachments.push({ name: 'attachments-by-app-'+id, datas: base64, res_model:model });
    }

    return (attachments.length > 0 ? forkJoin([...attachments.map(attachment =>
      this._odooService.create$<number>('ir.attachment', { ...attachment, ...{ res_id: id } })
    )]) : of([]))
  }
}
