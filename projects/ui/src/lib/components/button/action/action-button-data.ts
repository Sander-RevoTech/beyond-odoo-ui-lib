import { BydIconType } from '@beyond/icons';

export interface ActionButtonData {
  callback: (data?: any) => void;
  icon: BydIconType | string;
  label?: string;
}
