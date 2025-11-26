import { DATE_FORMAT } from "@/constants/format";
import dayjs, { Dayjs } from "dayjs";

export function cleanValues<T extends Record<string, any>>(values: T): Partial<T> {
  const entries: [keyof T, T[keyof T]][] = Object.entries(values) as [keyof T, T[keyof T]][];

  const cleaned = entries
    .filter(([_, v]) => {
      if (typeof v === "string") return v.trim() !== "";
      if (Array.isArray(v)) return v.some((item: string) => item.trim() !== "");
      return v !== null && v !== undefined;
    })
    .map(([key, v]) => {
      if (typeof v === "string") return [key, v.trim()] as [keyof T, T[keyof T]];
      if (Array.isArray(v))
        return [key, v.map((item: string) => item.trim()).filter((item: string) => item !== "")] as [keyof T, T[keyof T]];
      return [key, v] as [keyof T, T[keyof T]];
    });

  return Object.fromEntries(cleaned) as Partial<T>;
}

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return "";
  return dayjs(date).format(DATE_FORMAT);
};

export const parseDate = (date: string | Date): Dayjs => {
  return dayjs(date);
};

// utils/stringHelpers.ts
export function capitalizeWords(input: string): string {
  if (!input) return "";

  return input
    ?.replace(/[_-]/g, " ")
    ?.trim()
    ?.split(/\s+/)
    ?.map(
      word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    ?.join(" ");
}