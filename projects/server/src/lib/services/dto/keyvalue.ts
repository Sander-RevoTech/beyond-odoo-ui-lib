import { GraphSchema } from '../graphql/models/graphSchema';

export interface KeyValue {
  key: string;
  value: string;
}

export const keyValueProps = new GraphSchema<KeyValue>(['key', 'value']);
