export type Placeholder = {
    type: 'container' | 'row' | 'col' | 'item' | 'picture' | 'avatar';
    children?: Placeholder[];
    gridSize?: number;
    attributes?: ('big' | 'empty' | 'block' | 'no-shadow')[];
    repeat: number;
};
export declare const cardPlaceholder: Placeholder;
export declare const menuPlaceholder: Placeholder;
export declare const morePlaceholder: Placeholder;
export declare const fileListPlaceholder: Placeholder;
export declare const cardListPlaceholder: Placeholder;
export declare const detailPlaceholder: Placeholder;
export type PlaceholderConfig = 'default' | 'cardList' | 'detail' | 'fileList';
export declare const getPlaceholderConfig: (placeHolder: PlaceholderConfig) => Placeholder;
