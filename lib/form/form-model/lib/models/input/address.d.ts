import { IFormPanel, InputPanel } from './panel';
export declare enum EAddressValues {
    street = "street",
    streetNumber = "streetNumber",
    locality = "locality",
    postalCode = "postalCode",
    country = "country",
    longitude = "longitude",
    latitude = "latitude"
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
export interface IInputAddress extends IFormPanel {
}
export declare class InputAddress extends InputPanel {
    controlType: string;
    set value(data: IAddressValue);
    constructor(options?: IInputAddress);
}
