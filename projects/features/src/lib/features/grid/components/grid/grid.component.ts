import { Component, ElementRef, Input, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BydAbstractGridComponent } from '../abstract.component';
import { PaginationComponent } from "../pagination/pagination.component";
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';


@Component({
  selector: 'byd-grid',
  imports: [PaginationComponent, NgTemplateOutlet, AsyncPipe],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class BydGridComponent<T extends { id: number}> extends BydAbstractGridComponent<T> {

  @Input()
  cardTemplate!: TemplateRef<{ items: T[] }>;

  @ViewChild('table', { static: true }) tableElement!: ElementRef;

  constructor(private renderer: Renderer2) {
    super();
  }

  ngAfterViewInit() {
    this._registerSubscription(
      this.isReady$.subscribe({
        next: () => {
          if(this._grid.tableHtml){
            this.renderer.appendChild(this._grid.tableHtml.nativeElement, this.tableElement);
          }
        }
      })
    )
  }
}
