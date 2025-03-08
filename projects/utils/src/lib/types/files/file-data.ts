import { EFileExtension } from './file-extension';

export type FileType = 'Unknown' | 'Document' | 'Image';

export interface FileData<T = any> {
  id: number;
  url: string;
  thumbnailUrl?: string;
  type: FileType;
  fileExtension?: EFileExtension;
  name?: string;
  fileMetaData?: T;
  isLoading?: boolean;
  isSelected?: boolean;
}
