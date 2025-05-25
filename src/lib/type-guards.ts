import {PaginationInfo} from "@/api/client/types.gen";

export function isFullPagination(
    pagination: PaginationInfo | undefined
): pagination is Required<PaginationInfo> {
    return (
        pagination !== undefined &&
        typeof pagination.currentPage === 'number' &&
        typeof pagination.pageSize === 'number' &&
        typeof pagination.totalItems === 'bigint' &&
        typeof pagination.totalPages === 'number' &&
        typeof pagination.hasNext === 'boolean' &&
        typeof pagination.hasPrevious === 'boolean'
    );
}

