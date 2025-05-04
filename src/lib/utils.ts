import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateTS(date : Date) {
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

export const getFixedNumberFormat = (number : number) => {
  return (number > 1000) ? `${(number / 1000).toFixed(2)}K` : number.toString()
}
