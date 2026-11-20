# Kanban Backend API Documentation

Dokumentasi REST API backend Kanban menggunakan Hono di Next.js App Router. Dokumentasi ini dibuat sebagai panduan integrasi untuk tim state management (Zustand) dan UI.

---

## Struktur Folder

```
src/
├── app/
│   └── api/
│       └── [[...route]]/
│           └── route.ts         # Entry point Hono di Next.js App Router (basePath: /api)
├── data/
│   └── tasks.ts                 # In-memory static array data dummy awal
├── server/
│   └── routes/
│       └── tasks.ts             # Sub-route Hono untuk CRUD endpoint /tasks
└── types/
    └── task.ts                  # Kontrak tipe data TypeScript (Task, Status, Priority, DTO)
```

### Peran Masing-Masing File:
- **`src/types/task.ts`**: Single source of truth untuk semua tipe data task. Import tipe ini ke store Zustand atau komponen UI.
- **`src/data/tasks.ts`**: Menyimpan array data in-memory lokal `tasks: Task[]` sebagai mockup database.
- **`src/server/routes/tasks.ts`**: Handler logika route Hono untuk endpoint task (validasi input, manipulasi array, HTTP response).
- **`src/app/api/[[...route]]/route.ts`**: Menghubungkan route Hono ke Next.js App Router menggunakan adapter `hono/vercel`.

---

## Kontrak Tipe Data (`src/types/task.ts`)

```typescript
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus; // default: 'todo'
  priority?: TaskPriority; // default: 'medium'
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}
```

---

## Daftar Endpoint CRUD

Semua endpoint berada di bawah prefix `/api`.

| Method | Endpoint | Request Body | Response Status | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | *None* | `200 OK` | Mengambil semua daftar task |
| `POST` | `/api/tasks` | `CreateTaskInput` | `201 Created`<br>`400 Bad Request` | Menambah task baru (`id` UUID digenerate otomatis) |
| `PATCH` | `/api/tasks/:id` | `UpdateTaskInput` | `200 OK`<br>`404 Not Found` | Update parsial data task berdasarkan `id` |
| `DELETE` | `/api/tasks/:id` | *None* | `200 OK`<br>`404 Not Found` | Menghapus task dari daftar berdasarkan `id` |

### Detail Request & Response

#### 1. GET `/api/tasks`
Mengembalikan seluruh task dalam bentuk array JSON.

- **Response `200 OK`**:
```json
[
  {
    "id": "1",
    "title": "Research UI components",
    "description": "Review Tailwind and Lucide icon components for Kanban board",
    "status": "done",
    "priority": "high"
  }
]
```

#### 2. POST `/api/tasks`
Menambahkan task baru. Field `title` wajib diisi.

- **Request Body**:
```json
{
  "title": "Setup Zustand Store",
  "description": "Integrasikan fetching API ke Zustand",
  "status": "todo",
  "priority": "high"
}
```
- **Response `201 Created`**:
```json
{
  "id": "3f3484f2-53b0-4c3e-8c46-93d3957ce623",
  "title": "Setup Zustand Store",
  "description": "Integrasikan fetching API ke Zustand",
  "status": "todo",
  "priority": "high"
}
```
- **Response `400 Bad Request`** (jika `title` kosong atau bukan string):
```json
{
  "error": "Title is required"
}
```

#### 3. PATCH `/api/tasks/:id`
Memperbarui salah satu atau beberapa field pada task tertentu.

- **Request Body** (semua field opsional):
```json
{
  "status": "in-progress"
}
```
- **Response `200 OK`**:
```json
{
  "id": "3f3484f2-53b0-4c3e-8c46-93d3957ce623",
  "title": "Setup Zustand Store",
  "description": "Integrasikan fetching API ke Zustand",
  "status": "in-progress",
  "priority": "high"
}
```
- **Response `404 Not Found`**:
```json
{
  "error": "Task not found"
}
```

#### 4. DELETE `/api/tasks/:id`
Menghapus task dari array in-memory.

- **Response `200 OK`**:
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": "3f3484f2-53b0-4c3e-8c46-93d3957ce623",
    "title": "Setup Zustand Store",
    "status": "in-progress",
    "priority": "high"
  }
}
```
- **Response `404 Not Found`**:
```json
{
  "error": "Task not found"
}
```

---

## Panduan Integrasi (Frontend / Zustand)

### 1. Import Tipe Data
Gunakan path alias `@/types/task` untuk menjaga konsistensi tipe data:
```typescript
import type { Task, CreateTaskInput, UpdateTaskInput, TaskStatus, TaskPriority } from '@/types/task';
```

### 2. Pola Fetching di Zustand Store
Contoh integrasi aksi di store:

```typescript
// Fetch All
const fetchTasks = async () => {
  const res = await fetch('/api/tasks');
  const data: Task[] = await res.json();
  set({ tasks: data });
};

// Add Task
const addTask = async (input: CreateTaskInput) => {
  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (res.ok) {
    const newTask: Task = await res.json();
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  }
};

// Update Task (misal drag-and-drop ganti status)
const updateTaskStatus = async (id: string, status: TaskStatus) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (res.ok) {
    const updated: Task = await res.json();
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
    }));
  }
};

// Delete Task
const deleteTask = async (id: string) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  }
};
```
