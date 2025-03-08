import { FileData } from './file-data';

export interface FileStructure {
  file: File | null;
  localUrl: string | null;
}

export class TemporaryFile {
  public files: FileData[] = [];

  constructor() {}

  public addFiles(files: FileStructure[]): void {
    const fileData = this._convertToFileData(files);
    this.files = this.files.concat(fileData);
  }
  public removeFiles(files: FileStructure[]): void {
    const urls = files.map(file => file.localUrl);
    this.files = this.files.filter(file => !urls.includes(file.url));
  }
  public removeAll(): void {
    this.files = [];
  }

  private _convertToFileData(files: FileStructure[]) {
    return files.map<FileData>((file, index) => ({
      isLoading: true,
      id: index,
      type: 'Image',
      url: file.localUrl || '',
    }));
  }
}
