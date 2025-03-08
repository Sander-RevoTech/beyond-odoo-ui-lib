import { EFileExtension } from '../types/files/file-extension';
export declare const getFileExtension: (filePath: string) => EFileExtension;
export declare const getFullFileNameFromUrl: (url: string) => string | null;
export declare const trigram: (name: string | null | undefined) => string;
export declare const capitalizeFirstLetter: (value: string) => string;
export declare const convertToNumber: (values?: string[]) => number[];
export declare const isURL: (str: string) => boolean;
