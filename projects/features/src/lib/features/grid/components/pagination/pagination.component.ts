import { Component } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { MatIcon } from '@angular/material/icon';
import { NgTemplateOutlet } from '@angular/common';
import { TypedTemplateDirective } from '@beyond/utils';

type PageNumber = {
  number: number;
  icon?: string;
};
@Component({
  selector: 'byd-grid-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
  imports: [MatIcon, NgTemplateOutlet, TypedTemplateDirective],
})
export class PaginationComponent extends BydAbstractGridComponent<any> {
  readonly PageNumber!: { pagenumber: PageNumber };
  readonly maxPageNumber = 10;
  get grid() {
    return this._grid;
  }
  get show() {
    return this.paginationGetTotalPages > 1;
  }
  get paginationGetTotalPages() {
    return this.grid.table?.getPageMax() || 0;
  }

  constructor() {
    super();
  }

  public getListPage() {
    if (!this.grid || !this.grid.table) {
      return [];
    }
    const last = this.paginationGetTotalPages;

    if (last < this.maxPageNumber) {
      return this._computedPageNumbers(2, last);
    }

    const current = this.grid.table.getPage() || 0;
    const rangeStart = Math.floor(current / 10) * 10;
    const rangeEnd = rangeStart + 10;

    return [
      ...(rangeStart <= 1 ? [] : [{ number: rangeStart - 1, icon: 'more-line' }]),
      ...this._computedPageNumbers(rangeStart > 1 ? rangeStart : 2, rangeEnd < last ? rangeEnd : last),
      ...(rangeEnd > last ? [] : [{ number: rangeEnd, icon: 'more-line' }]),
    ];
  }

  private _computedPageNumbers(start: number, end: number): PageNumber[] {
    const pageNumbers = [];
    for (let i = start; i < end; i++) {
      pageNumbers.push({ number: i });
    }
    return pageNumbers;
  }
}
