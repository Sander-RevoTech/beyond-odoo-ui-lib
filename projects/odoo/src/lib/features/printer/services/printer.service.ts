import { Injectable } from '@angular/core';

import { filter, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { HandleComplexRequest, HandleSimpleRequest } from '@beyond/server';
import { isNonNullable } from '@beyond/utils';
import { BehaviorSubject, Observable, Subject, forkJoin, of } from 'rxjs';

import { BydBaseOdooService } from '../../../services/baseService';
import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLine, PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import { Printer } from './dto/printer';

@Injectable({
  providedIn: 'root',
})
export class BydPrinterService extends BydBaseOdooService {
  public askPrintingWizard$ = new Subject<{ id: number; model: string }>();

  public printers = new HandleSimpleRequest<Printer[]>();

  public printWizard = new HandleComplexRequest<PrintDirectWizard>();

  constructor() {
    super();
  }

  public printWizard$(data: { id: number; model: string }) {
    const model: Observable<PrintDirectWizard[]> =
      data.model === 'print.direct.wizard'
        ? this._odooService.searchRead$<PrintDirectWizard>(
            'print.direct.wizard',
            [['id', '=', data.id]],
            ['id', 'display_name', 'print_lines']
          )
        : of<PrintDirectWizard[]>([
            {
              id: data.id,
              display_name: '',
              print_lines: [data.id],
            },
          ]);

    return this.printWizard.fetch(
      data.id,
      model.pipe(
        filter(data => !!data),
        map(data => data[0]),
        mergeMap(entity =>
          this._odooService
            .searchRead$<PrintDirectWizardLine>(
              'print.direct.wizard.line',
              [['id', 'in', entity.print_lines]],
              ['id', 'display_name', 'print_qty', 'printer_id']
            )
            .pipe(
              map(lines => ({
                ...entity,
                ...{
                  lines,
                },
              }))
            )
        )
      )
    );
  }

  public fetchPrinters$() {
    return this.printers.fetch(
      this._odooService.searchRead$<Printer>('remote.printer.printer', [], ['id', 'name']).pipe(filter(isNonNullable))
    );
  }

  public print$(lines: PrintDirectWizardLinePost[]) {
    return forkJoin(
      lines.map(line => {
        if (line.print_qty === 0 || !line.printer_id) {
          return of();
        }
        return this._odooService
          .write$<PrintDirectWizardLine>('print.direct.wizard.line', line.id, line)
          .pipe(switchMap(() => this._odooService.action$('print.direct.wizard.line', 'action_print', line.id)));
      })
    );
  }
}
