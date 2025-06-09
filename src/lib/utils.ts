import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"
import {ResponseMetadata} from "@/api/client/types.gen";
import {isFullPagination} from "@/lib/type-guards";
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDateTS(date: Date) {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
}

//return a friendly format which is calculated from current day
export function formatDateDifference(dateInput: Date) {
    const now = new Date();
    const inputDate = new Date(dateInput);

    const diffInMilliseconds = inputDate.getTime() - now.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // If it's the same day
    if (Math.abs(diffInDays) === 0) {
        if (Math.abs(diffInHours) > 0) {
            return diffInHours > 0
                ? `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}`
                : `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) > 1 ? 's' : ''} ago`;
        } else if (Math.abs(diffInMinutes) > 0) {
            return diffInMinutes > 0
                ? `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
                : `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) > 1 ? 's' : ''} ago`;
        } else {
            return `just now`;
        }
    }

    // If it's a different day
    return diffInDays > 0
        ? `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}`
        : `${Math.abs(diffInDays)} day${Math.abs(diffInDays) > 1 ? 's' : ''} ago`;
}

export const getFixedNumberFormat = (number: number) => {
    return (number > 1000) ? `${(number / 1000).toFixed(2)}K` : number.toString()
}


export function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined;
}

export function throwIfUndefined<T>(value: T | undefined, message = "Undefined value detected!"): asserts value is T {
    if (value === undefined) {
        throw new Error(message);
    }
}

export const getNextPageParam = (
    lastPage: { metadata?: ResponseMetadata }
): number | null | undefined => {
    if (!lastPage || !isFullPagination(lastPage.metadata?.pagination)) {
        return null;
    }

    const pagination = lastPage?.metadata?.pagination;
    if (pagination) {
        const nextPage = pagination.currentPage + 1;
        return nextPage < pagination.totalPages ? nextPage : null;
    }
    return null;
};

type NormalizedChartData = { date: string } & Record<string, number>

export const normalizeChartData = <
    T extends Record<string, number | bigint | Date>
>(
    chartData: T[]
): NormalizedChartData[] => {
    return chartData.map((item) => {
        const result: Record<string, number | string> = {}

        for (const [key, value] of Object.entries(item)) {
            if (key === "date") {
                if (value instanceof Date) {
                    result.date = value.toISOString().split("T")[0]
                }
            } else if (typeof value === "bigint") {
                result[key] = Number(value)
            } else if (typeof value === "number") {
                result[key] = value
            }
        }

        return result as NormalizedChartData
    })
}

export const exportToExcel = (data: Record<string, unknown>[], fileName = 'data.xlsx', sheetName = 'Sheet1') => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
};
