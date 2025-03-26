import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';

export interface ITranslation {
  id: string;
  getTranslation(lang: string): Observable<object | null>;
}

@Injectable({
  providedIn: 'root',
})
export class CamTranslationRegistryService {
  registered: ITranslation[] = [];
  newRegistrationSubscription$ = new Subject();

  constructor() {}

  public register(register: ITranslation) {
    this.registered.push(register);
    this.newRegistrationSubscription$.next(null);
  }

  public getTranslations(lang: string) {
    return this.registered.map(r => r.getTranslation(lang));
  }
}
