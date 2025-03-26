import { NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

import { BydBaseComponent, TranslatePipe } from '@beyond/utils';

import { ENotificationCode } from '../../../enum';

@Component({
  selector: 'byd-notification-inline',
  templateUrl: './notification-inline.component.html',
  styleUrls: ['./notification-inline.component.scss'],
  standalone: true,
  imports: [TranslatePipe, NgSwitch, NgSwitchCase, NgClass, NgIf, MatIcon],
})
export class NotificationInlineComponent extends BydBaseComponent {
  @Input() set message(value: string) {
    this._message = value;
    this.showMessage = !!value;
  }

  @Input()
  code: ENotificationCode = ENotificationCode.information;

  @Input()
  showClose = true;

  @Output()
  askClose: EventEmitter<null> = new EventEmitter();

  public showMessage = false;

  get message(): string {
    return this._message;
  }
  get isError(): boolean {
    return this.code === ENotificationCode.error;
  }
  get isWarning(): boolean {
    return this.code === ENotificationCode.warning;
  }
  get isInformation(): boolean {
    return this.code === ENotificationCode.information;
  }
  get isSuccess(): boolean {
    return this.code === ENotificationCode.success;
  }

  private _message!: string;

  constructor() {
    super();
  }

  public close = () => {
    this.askClose.emit();
  };

  public getIcon(): string {
    if (this.isError) {
      return 'close-tool';
    }
    if (this.isWarning) {
      return 'warning';
    }
    if (this.isSuccess) {
      return 'checked';
    }
    return 'help';
  }
  public getTypeClass(): string {
    if (this.isError) {
      return 'danger';
    } else if (this.isWarning) {
      return 'warning';
    } else if (this.isInformation) {
      return 'info';
    } else if (this.isSuccess) {
      return 'success';
    } else {
      return '';
    }
  }
}
