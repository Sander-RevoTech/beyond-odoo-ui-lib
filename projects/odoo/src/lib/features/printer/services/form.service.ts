import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { InputBase, InputCheckBox, InputDropdown, InputLabel, InputNumber, InputPanel } from '@beyond/form-model';
import { getFirstNumber } from '@beyond/utils';

import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import { BydPrinterService } from './printer.service';

@Injectable({
  providedIn: 'root',
})
export class BydPrinterFormService {
  private readonly _printerService = inject(BydPrinterService);
  constructor() {
    this._printerService.fetchPrinters$().subscribe();
  }
  public getForm(wizard: PrintDirectWizard): InputBase<any>[] {
    /* printer */
    const printerItemsInput: InputDropdown<any>[] = [];
    const printerlistInput = new InputDropdown({
      key: 'printer',
      showNothingOption: true,
      class: 'g-col-5',
      options: this._printerService.printers.get$().pipe(
        map(
          printers =>
            printers?.map(printer => ({
              id: printer.id.toString(),
              name: printer.name,
            })) ?? []
        )
      ),
      readonly: true,
    });
    printerlistInput.changeValue$.subscribe(value => {
      printerItemsInput.forEach(item => (item.value = value ? value : null));
    });

    return [
      new InputPanel({
        key: 'panel',
        class: 'g-col-9',
        children: [
          new InputPanel({
            key: 'panel',
            class: 'p-15',
            contentClass: 'grid align-items-center',
            children: [
              new InputLabel({
                key: 'label',
                label: 'Printer: ',
              }),
              printerlistInput,
            ],
          }),
          new InputPanel({
            key: 'panel',
            contentClass: 'grid align-items-center fs-5',
            children: [
              new InputLabel({
                key: 'label',
                label: 'Label for',
                class: 'g-col-7 ta-c',
              }),
              new InputLabel({
                key: 'label',
                label: 'Quantity',
                class: 'g-col-2 ta-c',
              }),
              new InputLabel({
                key: 'label',
                label: 'Printer',
                class: 'g-col-3 ta-c',
              }),
            ],
          }),
          ...(wizard.lines?.map(line => {
            /** Print */
            const printerInput = new InputDropdown({
              key: 'line-' + line.id + '-printer',
              class: 'g-col-3',
              showNothingOption: true,
              options: this._printerService.printers.get$().pipe(
                map(
                  printers =>
                    printers?.map(printer => ({
                      id: printer.id.toString(),
                      name: printer.name,
                    })) ?? []
                )
              ),
              readonly: true,
              value: getFirstNumber(line.printer_id)?.toString(),
            });
            printerItemsInput.push(printerInput);
            /** qty */
            const qtyInput = new InputNumber({
              key: 'line-' + line.id + '-qty',
              class: 'g-col-2',
              value: line.print_qty.toString(),
            });

            return new InputPanel({
              key: 'panel',
              contentClass: 'grid align-items-center',
              children: [
                new InputCheckBox({
                  key: 'line-' + line.id + '-check',
                  class: 'g-col-1',
                  toggle: true,
                  value: true,
                }),
                new InputLabel({
                  key: 'label-' + line.id,
                  label: line.display_name,
                  class: 'g-col-6 fs-5',
                  value: line.id,
                }),
                qtyInput,
                printerInput,
              ],
            });
          }) ?? []),
        ],
      }),
    ];
  }

  public formatForm(data: any): PrintDirectWizardLinePost[] {
    const keys = Object.keys(data);
    const lineIds = keys
      .filter(key => key.startsWith('label-'))
      .map(key => data[key])
      .filter(id => data['line-' + id + '-check']);

    return lineIds.map(id => ({
      id: id,
      print_qty: Number(data['line-' + id + '-qty']),
      printer_id: Number(data['line-' + id + '-printer']),
    }));
  }
}
