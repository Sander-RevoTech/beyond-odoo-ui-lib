export declare class GraphSchema<T> {
    private _fields;
    constructor(_fields: Array<keyof T>);
    get(field: keyof T): keyof T | undefined;
}
