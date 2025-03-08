export type RecursivePartial<T> = {
    [P in keyof T]?: any;
};
export type MessageLevel = 'danger' | 'info' | 'warning' | 'success';
