import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, inject, signal } from '@angular/core';

import { ErrorComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { Observable } from 'rxjs';

import { BydAttachementsService } from '../../services/messages/attachments.service';
import { Attachment } from '../../services/messages/dto/attachment';

@Component({
  selector: 'byd-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  standalone: true,
  imports: [LoaderComponent, ErrorComponent, AsyncPipe],
})
export class BydImagesComponent extends BydBaseComponent implements OnInit {
  @Input()
  ids!: number[];

  private readonly _attachementsService = inject(BydAttachementsService);

  public images = signal<Observable<Attachment[]> | null>(null);

  constructor() {
    super();
  }

  ngOnInit() {
    this.images.set(this._attachementsService.attachmentsByIds.get$(this._attachementsService.keyByIds(this.ids)));
    this._fetch();
  }

  private _fetch() {
    this.requestState.asked();

    this._attachementsService.fetchByIds$(this.ids).subscribe({
      complete: () => this.requestState.completed(),
      error: (error: HttpErrorResponse) => {
        this.requestState.onError(error.status, error.statusText);
      },
    });
  }
}
