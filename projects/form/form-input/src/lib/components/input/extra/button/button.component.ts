import { AsyncPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { InputButton } from '@beyond/form-model';
import { TranslatePipe } from '@beyond/translation';
import { BydButtonComponent } from '@beyond/ui';


@Component({
  selector: 'byd-input-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: true,
  imports: [BydButtonComponent, TranslatePipe, AsyncPipe],
})
export class BydInputButtonComponent {
  @Input()
  input!: InputButton;
}
