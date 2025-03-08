import { FileData } from './file-data';
export interface FileStructure {
    file: File | null;
    localUrl: string | null;
}
export declare class TemporaryFile {
    files: FileData[];
    constructor();
    addFiles(files: FileStructure[]): void;
    removeFiles(files: FileStructure[]): void;
    removeAll(): void;
    private _convertToFileData;
}
