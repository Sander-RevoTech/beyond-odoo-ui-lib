export class Logger {
  public static DEBUG: Number = 0;
  public static INFO: Number = 1;
  public static WARNING: Number = 2;
  public static ERROR: Number = 3;

  public static config = { DEBUG: true, DEBUG_LEVEL: Logger.DEBUG };

  public static LogDebug(message: string, data?: string | Object | any): void {
    if (data === undefined) {
      data = '';
    }

    if (Logger.config.DEBUG && Logger.DEBUG >= Logger.config.DEBUG_LEVEL) {
      // tslint:disable-next-line:no-console
      console.debug(message, data);
    }
    this._fsLog('log', message, data);
  }

  public static LogInfo(message: string, ...data: any[]): void {
    if (Logger.config.DEBUG && Logger.INFO >= Logger.config.DEBUG_LEVEL) {
      // tslint:disable-next-line:no-console
      console.info(message, data);
    }
    this._fsLog('info', message, data);
  }

  public static LogWarning(message: string, data?: string | Object | any): void {
    if (data === undefined) {
      data = '';
    }

    if (Logger.config.DEBUG && Logger.WARNING >= Logger.config.DEBUG_LEVEL) {
      console.warn('/!\\ ' + message + ' /!\\', data);
    }
    this._fsLog('warn', message, data);
  }

  public static LogError(message: string, data?: any): void {
    if (data === undefined) {
      data = '';
    }

    if (Logger.config.DEBUG && Logger.ERROR >= Logger.config.DEBUG_LEVEL) {
      console.error('/!\\ ' + message + ' /!\\', data);
    }
    this._fsLog('error', message, data);
  }

  private static _fsLog(logLevel: string, message: string, data?: any) {
    if ((<any>window).FS) {
      (<any>window).FS.log(logLevel, `${message} | data: ${JSON.stringify(data)}`);
    }
  }
}
