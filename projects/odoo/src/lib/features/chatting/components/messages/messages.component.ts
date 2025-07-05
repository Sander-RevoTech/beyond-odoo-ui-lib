import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { TextBoxComponent } from '@beyond/form-input';
import { InputTextBox } from '@beyond/form-model';
import { BydButtonComponent, ErrorComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent, FileStructure } from '@beyond/utils';
import { Subject } from 'rxjs';

import { ODOO_SERVER_CONFIG_KEY } from '../../../../injectionToken';
import { BydMessagesService } from '../../services/messages/messages.service';
import { BydUploadComponent } from '../upload/files-upload.component';

@Component({
  selector: 'byd-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [
    BydButtonComponent,
    LoaderComponent,
    ErrorComponent,
    TextBoxComponent,
    MatIcon,
    BydUploadComponent,
    NgIf,
    NgFor,
    AsyncPipe,
  ],
})
export class BydMessagesComponent extends BydBaseComponent implements OnInit {
  @Input()
  id!: number;

  @Input()
  model!: string;

  readonly server = inject(ODOO_SERVER_CONFIG_KEY);
  readonly clearImage$ = new Subject<unknown>();

  private readonly _messagesService = inject(BydMessagesService);
  public input = new InputTextBox();
  public images = signal<FileStructure[]>([]);

  get disable() {
    return !this.input.value && this.images().length === 0;
  }
  get data$() {
    return this._messagesService.getMessages$(this.id);
  }
  constructor() {
    super();
    this.input.createFormControl();
  }

  ngOnInit() {
    this._fetch();
  }

  public getPicUrl(id: number) {
    return `${this.server.odooUrl}/web/image/${id}`;
  }

  public async send() {
    this.requestState.asked();
    const subject$ = await this._messagesService.postMessage$(
      this.id,
      {
        body: this.input.value ?? '',
        res_id: this.id,
        model: this.model,
        message_type: 'comment',
      },
      this.images()
    );

    subject$?.subscribe(() => {
      this._fetch();

      this.images.set([]);
      this.input.value = '';
      this.clearImage$.next(null);
    });
  }

  private _fetch() {
    this.requestState.asked();

    this._messagesService
      .fetchMessage$({
        res_id: this.id,
        model: this.model,
        message_type: 'comment',
      })
      .subscribe({
        complete: () => this.requestState.completed(),
        error: (error: HttpErrorResponse) => {
          this.requestState.onError(error.status, error.statusText);
        },
      });
  }
}
