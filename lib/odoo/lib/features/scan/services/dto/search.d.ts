export interface SearchItem {
    id: number;
    name: string;
    state: any;
    date: string;
    type: number;
    is_return?: boolean;
}
export interface SearchResult {
    deliveries: SearchItem[];
    returns: SearchItem[];
    work_orders: SearchItem[];
}
