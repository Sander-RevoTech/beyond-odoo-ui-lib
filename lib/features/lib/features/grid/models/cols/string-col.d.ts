import { InputTextBox } from "@beyond/form-model";
import { BaseCol } from "./base-col";
import { Filter } from "../types";
export declare class StringCol extends BaseCol<string> {
    getInputForm(): InputTextBox<string>;
    formatInputForm(data: any): Filter | null;
}
