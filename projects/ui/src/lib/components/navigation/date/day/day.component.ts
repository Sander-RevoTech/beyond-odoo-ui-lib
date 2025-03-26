import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { addDays } from 'date-fns';

import { BydButtonComponent } from '../../../button/button.component';
import { BydTitleComponent } from '../../../title/title.component';

@Component({
  selector: 'byd-navigation-date-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
  standalone: true,
  imports: [BydButtonComponent, BydTitleComponent, DatePipe, MatIcon],
})
export class BydNavigationDateDayComponent {
  @Input()
  viewDate: Date = new Date();

  @Output()
  viewDateChanged: EventEmitter<Date> = new EventEmitter();

  public previous() {
    this.viewDateChanged.emit(addDays(this.viewDate, -1));
  }
  public next() {
    this.viewDateChanged.emit(addDays(this.viewDate, +1));
  }
}
