export type RequeststateErrorType = {
    status: number;
    message: string;
};
export declare class RequestState {
    loading: import("@angular/core").WritableSignal<boolean>;
    error: RequeststateErrorType;
    alreadyAsked: boolean;
    isLoading(): boolean;
    getErrorStatus(): number;
    getErrorMessage(): string;
    clean(): void;
    asked(): void;
    completed(): void;
    resetError(): void;
    onError(status: number, message: string): void;
}
