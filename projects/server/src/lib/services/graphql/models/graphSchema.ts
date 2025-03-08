export class GraphSchema<T> {
  constructor(private _fields: Array<keyof T>) {}

  get(field: keyof T) {
    return this._fields.find(x => x === field);
  }
}
