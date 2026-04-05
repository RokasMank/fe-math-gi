/**
 * Maps a numeric assignment/session status to its display text.
 * Used in ViewTestAssignments and ViewAssignmentDetailsScreen.
 */
const STATUS_MAP = {
  0: { text: "Juodraštis", color: "gray.400" },
  1: { text: "Paskelbtas", color: "yellow.400" },
  2: { text: "Baigtas",    color: "green.400" },
};

export const getStatusText  = (status) => STATUS_MAP[status]?.text  ?? "Nežinoma";
export const getStatusColor = (status) => STATUS_MAP[status]?.color ?? "gray.400";

