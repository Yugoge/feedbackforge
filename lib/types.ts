// Type definitions per spec 5.3.

export type Employee = {
  id: string;
  name: string;
  age: number;
  role: string;
  /** Tenure formatted as a string e.g. "1 year" or "5 years". */
  tenure: string;
  department: string;
  /** Tailwind background-color class, e.g. "bg-blue-500". */
  avatarColor: string;
  /** Optional one-line description for dashboard cards (spec 5.7.3). */
  description?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type FeedbackSession = {
  employeeId: string;
  messages: Message[];
  status: "active" | "drafted" | "accepted";
};
