import { formatDistanceToNow } from "date-fns";

 export const formatDate = (timestamp: FirestoreTimestamp) => {
    if (!timestamp) return "--";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      console.error(err);
      return "--";
    }
  };

 export const formatFullDate = (timestamp: FirestoreTimestamp) => {
    if (!timestamp) return "--";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (err) {
      console.error(err);
      return "--";
    }
  };