import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

import { InputBase, InputEmail, InputPanel, InputPassword } from '@beyond/form-model';

@Injectable({
  providedIn: 'root',
})
export class AppUserFormService {
  constructor() {}

  public getLoginForm(): InputBase<any>[] {
    const form: InputBase<any>[] = [
      new InputPanel({
        key: 'panel',
        label: '',
        class: 'col-sm-12',
        children: [
          new InputEmail({
            key: 'email',
            label: 'Email',
            validators: [Validators.required],
          }),
          new InputPassword({
            key: 'password',
            label: 'Password',
          }),
        ],
      }),
    ];
    return form;
  }
  public formatLoginForm(data: any): { user: string; pass: string } {
    return {
      user: data.email,
      pass: data.password,
    };
  }
}
