import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { BydBaseComponent } from '@beyond/utils';
import { InputBase } from '@beyond/form-model';
import { Validators } from '@angular/forms';
import { delay, Observable } from 'rxjs';

@Component({ template: '' })
export abstract class BydAbstractInputComponent<
    C extends InputBase<any>,
    V = unknown
  >
  extends BydBaseComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  input!: C;

  @Input()
  matcher!: ErrorStateMatcher;

  @Input()
  standalone = false;

  @Input()
  onFocus!: Observable<void>;

  @Output()
  valueChanged = new EventEmitter<V>();

  @ViewChild('focusedElement', { read: ElementRef })
  focusedElement!: ElementRef;

  readonly validators = Validators;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.matcher === null) {
      this.matcher = new ErrorStateMatcher();
    }
    if (this.standalone) {
      this.input.createFormControl();
    }
    this._registerSubscription(
      this.input.changeValue$.subscribe({
        next: (value) => this.onChange(value),
      })
    );
  }

  ngAfterViewInit() {
    if (this.onFocus) {
      this._registerSubscription(
        this.onFocus.pipe(delay(1)).subscribe({
          next: () => {
            if (this.focusedElement) {
              this.focusedElement.nativeElement.click();
              this.focusedElement.nativeElement.focus();
            }
          },
        })
      );
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    if (this.standalone) {
      this.input.destroy();
    }
  }

  public onChange(value: V) {
    this.valueChanged.emit(value);
  }
}
