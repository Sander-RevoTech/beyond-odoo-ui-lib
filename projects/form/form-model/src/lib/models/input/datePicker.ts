import { IInputBase, InputBase } from './base';

export interface IInputDatePicker extends IInputBase<string | Partial<{ start: Date | null; end: Date | null }>> {
  minDate?: Date | 'today';
  maxDate?: Date | 'today';
  rangeEnabled?: boolean;
}

export class InputDatePicker extends InputBase<Date | Partial<{ start: Date | null; end: Date | null }>> {
  minDate: Date | null;
  maxDate: Date | null;
  rangeEnabled: boolean;

  constructor(options: IInputDatePicker = {}) {
    super(options);
    this.controlType = 'datePicker';

    this.minDate = this.parseDate(options.minDate);
    this.maxDate = this.parseDate(options.maxDate);
    this.rangeEnabled = options.rangeEnabled ?? false;
  }

  public parseDate(date?: Date | 'today'): Date | null {
    if (!date) {
      return null;
    }

    if (date instanceof Date) {
      return date;
    }

    switch (date) {
      case 'today':
        return new Date();
      default:
        return new Date(date);
    }
  }
}
