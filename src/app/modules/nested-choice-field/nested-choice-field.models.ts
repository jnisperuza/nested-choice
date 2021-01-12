import { MatIcon } from '@angular/material/icon';

export interface PopperRef {
  reference: HTMLElement | Element;
  popper: HTMLElement | Element;
  destroy: () => void;
}

export interface Option {
  id: number | string;
  label: string;
  isParent?: boolean;
  icon?: string | MatIcon;
  children?: Option[];
  [key: string]: string | any;
}

export interface Icon {
  type: string;
  path: string;
}
