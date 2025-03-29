import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { AppMessagesService } from '../../services/messages/messages.service';
import { BydBaseComponent, FileStructure } from '@beyond/utils';
import { InputTextBox } from '@beyond/form-model';
import { BydButtonComponent, ErrorComponent, LoaderComponent } from '@beyond/ui';
import { TextBoxComponent } from '@beyond/form-input';
import { MatIcon } from '@angular/material/icon';
import { BydUploadComponent } from '../upload/files-upload.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'byd-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: true,
  imports: [BydButtonComponent, LoaderComponent, ErrorComponent, TextBoxComponent, MatIcon, BydUploadComponent, NgIf, NgFor, AsyncPipe],
})
export class BydMessagesComponent extends BydBaseComponent implements OnInit {
  @Input()
  id!: number;

  @Input()
  model!: string;

  public input = new InputTextBox();

  public tempImages: FileStructure[] = [];

  get disable() {
    return !this.input.value && this.tempImages.length === 0;
  }
  get data$() {
    return this._messagesService.getMessages$(this.id);
  }
  constructor(private _messagesService: AppMessagesService) {
    super();
    this.input.createFormControl();
  }

  ngOnInit() {
    this._fetch();
  }

  public uploadImage(images: FileStructure[]) {
    this.tempImages = [...this.tempImages, ...images];
  }
  public remove(pic: FileStructure) {
    this.tempImages = this.tempImages.filter(item => item.localUrl !== pic.localUrl);
  }

  public getPicUrl(id: number) {
    return ""; // `${environment.server.odooUrl}/web/image/${id}`;
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
      this.tempImages
    );

    subject$?.subscribe(() => {
      this._fetch();

      this.tempImages = [];
      this.input.value = '';
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
