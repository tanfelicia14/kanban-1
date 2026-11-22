import { Column, Task } from "../types/kanban";

export const columns: Column[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const initialTasks: Task[] = [
  {
    id: "1",
    title: "Rancang wireframe",
    description: "Buat sketsa tampilan board di Figma.",
    priority: "high",
    columnId: "todo",
  },
  {
    id: "2",
    title: "Setup project Next.js",
    description: "Install dependency dan rapikan struktur folder.",
    priority: "medium",
    columnId: "in-progress",
  },
  {
    id: "3",
    title: "Tentukan pembagian tugas",
    description: "Diskusi dengan tim siapa mengerjakan apa.",
    priority: "low",
    columnId: "done",
  },
];