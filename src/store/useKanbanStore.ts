import { create } from 'zustand';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
} from '@/types/task';

interface KanbanStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (input: CreateTaskInput) => Promise<boolean>;
  updateTask: (id: string, input: UpdateTaskInput) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
}

export const useKanbanStore = create<KanbanStore>((set) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // 1. GET /api/tasks
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Gagal memuat daftar task');
      }
      const data: Task[] = await res.json();
      set({ tasks: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Terjadi kesalahan jaringan',
        isLoading: false,
      });
    }
  },

  // 2. POST /api/tasks
  addTask: async (input) => {
    set({ error: null });
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan task');
      }

      const newTask: Task = data;
      set((state) => ({
        tasks: [...state.tasks, newTask],
      }));
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Gagal menambahkan task',
      });
      return false;
    }
  },

  // 3. PATCH /api/tasks/:id
  updateTask: async (id, input) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal memperbarui task');
      }

      const updatedTask: Task = data;
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? updatedTask : task
        ),
      }));
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Gagal memperbarui task',
      });
      return false;
    }
  },

  // 4. DELETE /api/tasks/:id
  deleteTask: async (id) => {
    set({ error: null });
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus task');
      }

      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
      }));
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Gagal menghapus task',
      });
      return false;
    }
  },
}));