import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { addDays, endOfWeek, getISODay, getWeek, startOfWeek, startOfYear } from 'date-fns';
import { BydButtonComponent } from '../../../button/button.component';
import { BydTitleComponent } from '../../../title/title.component';


@Component({
  selector: 'byd-navigation-date-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss'],
    standalone: true,
    imports: [BydButtonComponent, BydTitleComponent, DatePipe, MatIcon]
})
export class BydNavigationDateWeekComponent {
  @Input()
  viewDate: Date = new Date();

  @Output()
  viewDateChanged: EventEmitter<Date> = new EventEmitter();

  get fromDay() {
    return startOfWeek(this.viewDate, { weekStartsOn: 1 });
  }
  get toDay() {
    return endOfWeek(this.viewDate, { weekStartsOn: 1 });
  }
  get weekInYear() {
    const firstDayOfYear = startOfYear(this.viewDate);
    return getWeek(this.viewDate, { weekStartsOn: 1, firstWeekContainsDate: <any>getISODay(firstDayOfYear) });
  }

  public previous() {
    this.viewDateChanged.emit(addDays(this.fromDay, -7));
  }
  public next() {
    this.viewDateChanged.emit(addDays(this.fromDay, +7));
  }
}
