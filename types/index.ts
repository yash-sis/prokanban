export type Status = "WAITING" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Attachment {
  id: string;
  type: "link" | "file";
  name: string;
  url?: string;
  fileData?: string;
  mimeType?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  dueDate?: string;
  projectId: string;
  isPinned: boolean;
  attachments: Attachment[];
  comments: Comment[];
  tags: Tag[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  tags: Tag[];
}

export interface FilterOptions {
  status?: Status;
  priority?: Priority;
  tags?: string[];
}

export type SortOption = "dueDate" | "priority" | "createdAt" | "title";
