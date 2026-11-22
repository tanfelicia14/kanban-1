export type ColumnId = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: ColumnId; // task ini sedang berada di kolom mana
}

export interface Column {
  id: ColumnId;
  title: string;
}