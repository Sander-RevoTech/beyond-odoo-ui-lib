import { TaIconType } from '@beyond/icons';

export interface ActionButtonData {
  callback: (data?: any) => void;
  icon: TaIconType | string;
  label?: string;
}
