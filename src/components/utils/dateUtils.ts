/**
 * Extracts the date and time from a Firestore timestamp string.
 * @param timestamp - The ISO timestamp string (e.g., "2024-12-10T01:45:42.602659Z").
 * @returns An object with `date` and `time` properties.
 */

export const formatFirestoreTimestamp = (
    timestamp: string | null | undefined
): string => {
    if (!timestamp) return "Unknown";

    // Split the ISO string and return the date part
    const parts = timestamp.split("T");
    return parts.length > 0 ? parts[0] : "Unknown";
};

export function extractMonthAndDay(dateStr: string): { month: string; day: string } {
    // Split the date string into parts: ["June", "25,", "2024"]
    const dateParts = dateStr.split(" ");
  
    if (dateParts.length < 3) {
      throw new Error("Invalid date format");
    }
  
    const month = dateParts[0].slice(0, 3); // Get the first 3 letters of the month
    const day = dateParts[1].replace(",", ""); // Remove the comma from the day part
  
    return { month, day };
  }
  
  export function extractDateAndTime(timestamp: string): { date: string; time: string } {
    if (!timestamp) {
      throw new Error("Invalid timestamp");
    }
  
    // Split the timestamp into date and time parts
    const [datePart, timePart] = timestamp.split("T");
  
    if (!datePart || !timePart) {
      throw new Error("Invalid timestamp format");
    }
  
    // Extract the time without the milliseconds and 'Z'
    const time = timePart.split(".")[0];
  
    return { date: datePart, time };
  }