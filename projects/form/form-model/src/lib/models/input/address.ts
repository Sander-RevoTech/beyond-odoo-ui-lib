import { IFormPanel, InputPanel } from './panel';
import { InputTextBox } from './textbox';

export enum EAddressValues {
  street = 'street',
  streetNumber = 'streetNumber',
  locality = 'locality',
  postalCode = 'postalCode',
  country = 'country',
  longitude = 'longitude',
  latitude = 'latitude',
}

export interface IAddressValue {
  street: string;
  streetNumber: number;
  locality: string;
  postalCode: number;
  country: string;
  longitude: number;
  latitude: number;
}
export interface IInputAddress extends IFormPanel {}
export class InputAddress extends InputPanel {
  override controlType = 'address';

  override set value(data: IAddressValue) {
    this.children.find(x => x.key === EAddressValues.street)!.value = data.street;
    this.children.find(x => x.key === EAddressValues.streetNumber)!.value = data.streetNumber;
    this.children.find(x => x.key === EAddressValues.country)!.value = data.country;
    this.children.find(x => x.key === EAddressValues.locality)!.value = data.locality;
    this.children.find(x => x.key === EAddressValues.postalCode)!.value = data.postalCode;
    this.children.find(x => x.key === EAddressValues.longitude)!.value = data.longitude;
    this.children.find(x => x.key === EAddressValues.latitude)!.value = data.latitude;
  }

  constructor(options: IInputAddress = {}) {
    super(options);
    this.type = 'address';
    this.children.push(
      new InputTextBox({
        key: EAddressValues.street,
      }),
      new InputTextBox({
        key: EAddressValues.streetNumber,
      }),
      new InputTextBox({
        key: EAddressValues.locality,
      }),
      new InputTextBox({
        key: EAddressValues.country,
      }),
      new InputTextBox({
        key: EAddressValues.postalCode,
      }),
      new InputTextBox({
        key: EAddressValues.longitude,
      }),
      new InputTextBox({
        key: EAddressValues.latitude,
      })
    );
  }
}
