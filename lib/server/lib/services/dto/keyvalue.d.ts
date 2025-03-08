import { GraphSchema } from '../graphql/models/graphSchema';
export interface KeyValue {
    key: string;
    value: string;
}
export declare const keyValueProps: GraphSchema<KeyValue>;
