export type Role = "user" | "assistant" | "system";

export type MessageStatus = "pending" | "streaming" | "done" | "error";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  status: MessageStatus;
  timestamp: Date;
}

export type Theme = "dark" | "light";

export interface AppState {
  messages: ChatMessage[];
  isStreaming: boolean;
  theme: Theme;
  model: string;
}
