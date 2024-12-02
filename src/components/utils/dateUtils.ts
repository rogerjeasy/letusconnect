export const formatFirestoreTimestamp = (
    timestamp: string | null | undefined
): string => {
    if (!timestamp) return "Unknown";

    // Split the ISO string and return the date part
    const parts = timestamp.split("T");
    return parts.length > 0 ? parts[0] : "Unknown";
};