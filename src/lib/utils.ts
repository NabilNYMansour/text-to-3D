import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function encodeJson(data: any) { // eslint-disable-line
  const buffer = Buffer.from(JSON.stringify(data));
  return encodeURIComponent(buffer.toString('base64'));
}

export function decodeJson(data: string) {
  const buffer = Buffer.from(decodeURIComponent(data), 'base64');
  return JSON.parse(buffer.toString());
}