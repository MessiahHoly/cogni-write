import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()

export const formatQuery = (query: string) => query.trim().split(/\s+/).filter(Boolean).join(' & ')

/**
 * Wraps matching query terms in a styled <mark> element.
 */
export const highlightText = (text: string, query?: string) => {
  if (!query || !query.trim()) return text;

  // Escape special regex characters in user search query
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLocaleLowerCase() ? (
      <mark key={index}
        className="bg-yellow-200 text-black dark:bg-yellow-500/30 dark:text-yellow-200 rounded-sm px-0.5 font-medium">
        {part}
      </mark>
    ) : (
      part
    )
  );
}