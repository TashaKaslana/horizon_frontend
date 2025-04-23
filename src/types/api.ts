export interface RestApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error: ApiErrorResponse | null;
    timestamp: string;
    metadata: ResponseMetadata | null;
}

export interface ApiErrorResponse {
    status: number;
    message: string;
    path: string;
    timestamp: string;
    error: string;
    fieldErrors?: Record<string, string>;
    globalErrors?: string[];
}

export interface ResponseMetadata {
    pagination?: PaginationInfo;
    links?: Record<string, string>;
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
