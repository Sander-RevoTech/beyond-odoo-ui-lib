import { signal } from '@angular/core';

export type RequeststateErrorType = { status: number; message: string };

export class RequestState {
  public loading = signal(false);

  public error: RequeststateErrorType = { status: -1, message: '' };
  public alreadyAsked = false;

  public isLoading() {
    return this.loading();
  }
  public getErrorStatus() {
    return this.error.status;
  }
  public getErrorMessage() {
    return this.error.message;
  }
  public clean() {
    this.alreadyAsked = false;
    this.loading.set(false);
    this.resetError();
  }
  public asked() {
    this.alreadyAsked = true;
    this.loading.set(true);
    this.resetError();
  }
  public completed() {
    this.loading.set(false);
  }
  public resetError() {
    this.error = { status: -1, message: '' };
  }
  public onError(status: number, message: string) {
    this.loading.set(false);
    this.error = { status, message };
  }
}
