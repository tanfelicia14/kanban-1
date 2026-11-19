import type { Task } from '@/types/task';

export const tasks: Task[] = [
  {
    id: '1',
    title: 'Research UI components',
    description: 'Review Tailwind and Lucide icon components for Kanban board',
    status: 'done',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Develop REST API',
    description: 'Build in-memory CRUD endpoints using Hono inside Next.js App Router',
    status: 'in-progress',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Implement drag-and-drop',
    description: 'Allow moving tasks between todo, in-progress, and done columns',
    status: 'todo',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Write automated tests',
    description: 'Ensure API endpoints return correct status codes and payloads',
    status: 'todo',
    priority: 'low',
  },
];
