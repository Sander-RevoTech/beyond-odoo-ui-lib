import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { BydTitleComponent } from '@beyond/ui';

import { BydAbstractGridComponent } from '../abstract.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'byd-grid',
  imports: [PaginationComponent, NgTemplateOutlet, AsyncPipe, BydTitleComponent],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class BydGridComponent<T extends { id: number }> extends BydAbstractGridComponent<T> {
  @Input()
  cardTemplate!: TemplateRef<{ items: T[] }>;

  @Output()
  rowClicked = new EventEmitter<T>();

  @ViewChild('table', { static: true })
  tableElement!: ElementRef;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    this._registerSubscription(
      this.isReady$.subscribe({
        next: () => {
          if (this._grid.tableHtml) {
            this.renderer.appendChild(this.tableElement.nativeElement, this._grid.tableHtml.nativeElement);
          }
          this._registerSubscription(this._grid.rowClicked$.subscribe({ next: row => this.rowClicked.emit(row) }));
        },
      })
    );
  }
}
