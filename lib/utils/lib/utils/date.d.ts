export declare const toLocalDateString: (utcDateString: string) => string;
export declare const toLocalDate: (utcDateString: string) => Date;
export declare const toUtcDate: (localDateString: Date) => Date;
export declare const diffInHourAndMinutes: (start: string, end: string) => {
    h: string;
    m: string;
};
