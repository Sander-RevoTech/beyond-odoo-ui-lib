import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { InputBase } from '@beyond/form-model';
import { LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import { Observable } from 'rxjs';

import { BydFormComponent } from '../form.component';

export type Layout = 'row' | 'column';

@Component({
  selector: 'byd-edit-field',
  templateUrl: './edit-field.component.html',
  styleUrls: ['./edit-field.component.scss'],
  standalone: true,
  imports: [NgIf, NgClass, NgStyle, LoaderComponent, BydFormComponent],
})
export class EditFieldComponent extends BydBaseComponent implements OnInit, OnChanges {
  @Input()
  layout: Layout = 'row';

  @Input()
  getInput!: () => InputBase<any>;

  @Input()
  changeEditMode$: Observable<boolean> | null = null;

  @Input()
  isLoading: boolean = false;

  @Output()
  newValue: EventEmitter<unknown> = new EventEmitter();

  @Input()
  height: string = '22px';

  @Input()
  withBorder: boolean = true;

  public input!: InputBase<any>;
  public editMode = false;

  ngOnInit() {
    if (this.changeEditMode$) {
      this._registerSubscription(this.changeEditMode$.subscribe(value => (this.editMode = value)));
    }
    this.input = this.getInput();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isLoading'] &&
      changes['isLoading'].currentValue !== changes['isLoading'].previousValue &&
      changes['isLoading'].currentValue === false
    ) {
      this.input = this.getInput();
      this.editMode = false;
    }
  }
  public toggleEditMode() {
    this.editMode = !this.editMode;
  }

  public validation() {
    this.newValue.emit(this.input.value);

    this.toggleEditMode();
  }
}
