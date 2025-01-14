"use client";

/**
 * Truncates a given text to a maximum number of words.
 * @param textToTruncate - The input text to truncate.
 * @param maxWords - The maximum number of words to keep. Default is 50.
 * @returns A string containing the first `maxWords` words followed by "..." if truncated.
 */
export function truncateText(textToTruncate: string, maxWords: number = 20): string {
    const words = textToTruncate.split(" ");
    if (words.length <= maxWords) {
        return textToTruncate;
    }
    return words.slice(0, maxWords).join(" ") + "...";
}
