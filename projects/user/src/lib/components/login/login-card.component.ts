import { Component, inject } from '@angular/core';

import { BydAuthOdooService } from '@beyond/odoo';
import { BydButtonComponent, CardContentComponent, CardComponent } from '@beyond/ui';

@Component({
  selector: 'byd-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss'],
  imports: [CardComponent, CardContentComponent, BydButtonComponent],
  standalone: true
})
export class LoginCardComponent {
  private readonly _authService = inject(BydAuthOdooService);

  constructor() {}

  public login() {
    this._authService.login({
      identifier: 'pikadjou@gmail.com',
      password: 'blacks-159'
    });
  }
}
