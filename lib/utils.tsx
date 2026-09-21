import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim()

export const formatQuery = (query: string) => query.trim().split(/\s+/).filter(Boolean).join(' & ')

/**
 * Wraps matching query terms in a styled <mark> element.
 * Supports multi-word queries (e.g., "react nextjs").
 */
export const highlightText = (text: string, query?: string) => {
  if (!query || !query.trim()) return text;

  // 1. Extract non-empty individual words from query
  const words = query.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return text;

  // 2. Escape special regex characters for each word
  const escapedWords = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // 3. Create a set of lowercase words for quick match checking
  const querySet = new Set(words.map(word => word.toLowerCase()));

  // 4. Create regex to match ANY of the search words (case-insensitive)
  const regex = new RegExp(`(${escapedWords.join('|')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    querySet.has(part.toLowerCase()) ? (
      <mark key={index}
        className="bg-yellow-200 text-black dark:bg-yellow-500/30 dark:text-yellow-200 rounded-sm px-0.5 font-medium">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

//   const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   // const regex = new RegExp(`(${escapedQuery})`, 'gi');
//   // const parts = text.split(regex);

//   return parts.map((part, index) =>
//     part.toLowerCase() === query.toLocaleLowerCase() ? (
//       <mark key={index}
//         className="bg-yellow-200 text-black dark:bg-yellow-500/30 dark:text-yellow-200 rounded-sm px-0.5 font-medium">
//         {part}
//       </mark>
//     ) : (
//       part
//     )
//   );
// }