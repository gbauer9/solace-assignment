export type WithPagination<T> = {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
}