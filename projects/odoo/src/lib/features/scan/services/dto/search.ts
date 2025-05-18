export interface SearchItem {
  id: number;
  name: string;
  state: any;
  date: string;
  type: number;
  is_return?: boolean;
}

export interface SearchResult {
  [index: string]: SearchItem[];
}
