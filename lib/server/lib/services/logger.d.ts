export declare class Logger {
    static DEBUG: Number;
    static INFO: Number;
    static WARNING: Number;
    static ERROR: Number;
    static config: {
        DEBUG: boolean;
        DEBUG_LEVEL: Number;
    };
    static LogDebug(message: string, data?: string | Object | any): void;
    static LogInfo(message: string, ...data: any[]): void;
    static LogWarning(message: string, data?: string | Object | any): void;
    static LogError(message: string, data?: any): void;
    private static _fsLog;
}
