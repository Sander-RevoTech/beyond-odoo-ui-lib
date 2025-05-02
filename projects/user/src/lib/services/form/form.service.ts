import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { InputBase, InputCheckBox, InputEmail, InputPanel, InputPassword, InputSwitch } from '@beyond/form-model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppUserFormService {
  constructor() {}

  public getLoginForm(): InputBase<any>[] {
    const asAdmin = new InputCheckBox({
      key: 'asAdmin',
      label: 'Login as admin',
      class: 'col-sm-12',
      toggle: true,
    })

    return [
      new InputPanel({
        key: 'panel',
        label: '',
        class: 'col-sm-12',
        children: [
          asAdmin,
          new InputEmail({
            key: 'email',
            label: 'Email',
            validators: [Validators.required],
            visible$: asAdmin.changeValue$
          }),
          new InputPassword({
            key: 'password',
            label: 'Password',
          }),
        ],
      }),
    ];
  }
  public formatLoginForm(data: any): { user: string | null; pass: string } {
    return {
      user: data.email ?? null,
      pass: data.password,
    };
  }
}
