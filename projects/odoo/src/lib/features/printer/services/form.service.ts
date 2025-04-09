import { inject, Injectable } from '@angular/core';

import { map } from 'rxjs/operators';


import { PrintDirectWizard } from './dto/print_direct_wizard';
import { PrintDirectWizardLinePost } from './dto/print_direct_wizard_line';
import { BydPrinterService } from './printer.service';
import { InputBase, InputDropdown, InputPanel, InputLabel, InputNumber, InputCheckBox } from '@beyond/form-model';
import { getFirstNumber } from '@beyond/utils';

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
      class: 'col-5',
      options: this._printerService.printers$.pipe(
        map(printers =>
          printers.map(printer => ({
            id: printer.id.toString(),
            name: printer.name,
          }))
        )
      ),
    });
    printerlistInput.changeValue$.subscribe(value => {
      printerItemsInput.forEach(item => (item.value = (value ? value : null)));
    });

    /* Qty */
    // const qtyItemsInput: InputNumber[] = [];
    // const qtylistInput = new InputNumber({
    //   key: 'qty',
    //   class: 'col-2',
    // });
    // qtylistInput.changeValue$.subscribe(value => {
    //   qtyItemsInput.forEach(item => (value ? item.formControl.setValue(value) : null));
    // });
    return [
      new InputPanel({
        key: 'panel',
        class: 'col-9',
        children: [
          new InputPanel({
            key: 'panel',
            class: 'p-15',
            contentClass: 'row align-items-center',
            children: [
              new InputLabel({
                key: 'label',
                label: 'Printer: ',
                class: 'col-auto',
              }),
              printerlistInput,
            ],
          }),
          new InputPanel({
            key: 'panel',
            contentClass: 'row align-items-center fs-5',
            children: [
              new InputLabel({
                key: 'label',
                label: 'Label for',
                class: 'col-7 ta-c',
              }),
              new InputLabel({
                key: 'label',
                label: 'Quantity',
                class: 'col-2 ta-c',
              }),
              new InputLabel({
                key: 'label',
                label: 'Printer',
                class: 'col-3 ta-c',
              }),
            ],
          }),
          ...(wizard.lines?.map(line => {
            /** Print */
            const printerInput = new InputDropdown({
              key: 'line-' + line.id + '-printer',
              class: 'col-3',
              showNothingOption: true,
              options: this._printerService.printers$.pipe(
                map(printers =>
                  printers.map(printer => ({
                    id: printer.id.toString(),
                    name: printer.name,
                  }))
                )
              ),
              value: getFirstNumber(line.printer_id)?.toString(),
            });
            printerItemsInput.push(printerInput);
            /** qty */
            const qtyInput = new InputNumber({
              key: 'line-' + line.id + '-qty',
              class: 'col-2',
              value: line.print_qty.toString(),
            });
            // qtyItemsInput.push(qtyInput);

            return new InputPanel({
              key: 'panel',
              contentClass: 'row align-items-center',
              children: [
                new InputCheckBox({
                  key: 'line-' + line.id + '-check',
                  class: 'col-1',
                  toggle: true,
                  value: true,
                }),
                new InputLabel({
                  key: 'label-' + line.id,
                  label: line.display_name,
                  class: 'col-6 fs-5',
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
