export interface IPaginationParams {
  search?: string;
  pageSize?: number;
  pageNumber?: number;
}

export interface IResponse<T> {
  totalRecords: number;
  hasNextPage: boolean;
  data: T;
}
