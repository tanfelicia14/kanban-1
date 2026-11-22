"use client";

import { Priority, Task } from "../../types/kanban";
import Button from "../../ui/button";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityBadge: Record<Priority, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

// Garis warna di sisi kiri kartu
const priorityBorder: Record<Priority, string> = {
  low: "border-l-green-400",
  medium: "border-l-yellow-400",
  high: "border-l-red-400",
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", task.id)}
      className={`cursor-grab rounded-lg border-l-4 bg-white p-3 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${priorityBorder[task.priority]}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityBadge[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-slate-600">{task.description}</p>
      )}

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="bg-slate-100! hover:bg-slate-200!"
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Hapus
        </Button>
      </div>
    </div>
  );
}