export declare enum EToast {
    none = 0,
    error = 1,
    warning = 2,
    information = 3,
    success = 4
}
export declare const getTypeClass: (code: EToast) => "" | "danger" | "info" | "warning" | "success";
