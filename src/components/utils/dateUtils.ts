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
  