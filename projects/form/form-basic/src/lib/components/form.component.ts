import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInputsError, InputBase } from '@beyond/form-model';
import { NotificationInlineComponent } from '@beyond/notification';
import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent, LoaderComponent } from '@beyond/ui';
import { BydBaseComponent } from '@beyond/utils';
import deepEqual from 'fast-deep-equal';
import { Observable, distinctUntilChanged } from 'rxjs';

import { InputsComponent } from './inputs/inputs.component';

@Component({
  selector: 'byd-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  standalone: true,
  imports: [
    InputsComponent,
    NgFor,
    NgIf,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    LoaderComponent,
    BydButtonComponent,
    TranslatePipe,
    NotificationInlineComponent,
  ],
})
export class BydFormComponent extends BydBaseComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  inputs!: InputBase<any>[];

  @Input()
  askValidation$!: Observable<null>;

  @Input()
  askOnDestroy!: boolean;

  @Input()
  loader = false;
  @Input()
  error: IInputsError = { status: 0, message: '' };

  @Input()
  border = true;

  @Input()
  canDisplayButton = true;
  @Input()
  buttonTitle = 'form.save';

  @Input()
  onLive = false;

  @Output()
  valid: EventEmitter<{}> = new EventEmitter();

  @Output()
  isFormValid = new EventEmitter<boolean>();

  public form!: FormGroup;

  constructor() {
    super();
  }

  ngOnInit() {
    this.form = this.toFormGroup(this.inputs);

    this._registerSubscription(this.form.statusChanges.subscribe(() => this.isFormValid.emit(this.isValid())));

    if (this.onLive) {
      this._registerSubscription(
        this.form.valueChanges
          .pipe(distinctUntilChanged((prev, curr) => deepEqual(prev, curr)))
          .subscribe(() => this.onSubmit())
      );
    }

    if (this.askValidation$) {
      this._registerSubscription(this.askValidation$.subscribe(_ => this.onSubmit()));
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['inputs'] && !simpleChanges['inputs'].firstChange) {
      this.form = this.toFormGroup(this.inputs);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.inputs.forEach(input => {
      input.destroy();
    });
    if (this.askOnDestroy) {
      this.onSubmit();
    }
  }

  public onSubmit() {
    if (!this.isValid()) {
      return;
    }
    this.valid.emit(this.form.value);
  }

  public isValid(): boolean {
    return this.form.valid && !this.loader;
  }

  public toFormGroup(inputs: InputBase<any>[]): FormGroup {
    const group = new FormGroup({});
    if (inputs === null || inputs.length === 0) {
      return group;
    }
    inputs.forEach(input => {
      input.createFormControl(group);
    });
    return group;
  }
}
