"use client";

import { useState } from "react";
import { Column as ColumnType, ColumnId, Task } from "../../types/kanban";
import Button from "../../ui/button";
import TaskCard from "./taskcard";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAdd: (columnId: ColumnId) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onDropTask: (taskId: string, columnId: ColumnId) => void;
}

// Satu objek berisi semua class warna per kolom
const columnTheme: Record<
  ColumnId,
  { bg: string; bgOver: string; top: string; badge: string; title: string }
> = {
  todo: {
    bg: "bg-sky-50",
    bgOver: "bg-sky-100",
    top: "border-sky-400",
    badge: "bg-sky-200 text-sky-800",
    title: "text-sky-800",
  },
  "in-progress": {
    bg: "bg-amber-50",
    bgOver: "bg-amber-100",
    top: "border-amber-400",
    badge: "bg-amber-200 text-amber-800",
    title: "text-amber-800",
  },
  done: {
    bg: "bg-emerald-50",
    bgOver: "bg-emerald-100",
    top: "border-emerald-400",
    badge: "bg-emerald-200 text-emerald-800",
    title: "text-emerald-800",
  },
};

export default function Column({
  column,
  tasks,
  onAdd,
  onEdit,
  onDelete,
  onDropTask,
}: ColumnProps) {
  const [isOver, setIsOver] = useState(false);
  const theme = columnTheme[column.id];

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId, column.id);
      }}
      className={`flex min-h-75 flex-col rounded-xl border-t-4 p-3 shadow-sm transition-colors ${theme.top} ${
        isOver ? theme.bgOver : theme.bg
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className={`font-bold ${theme.title}`}>
          {column.title}{" "}
          <span
            className={`ml-1 rounded-full px-2 py-0.5 text-xs ${theme.badge}`}
          >
            {tasks.length}
          </span>
        </h2>
        <Button variant="secondary" onClick={() => onAdd(column.id)}>
          + Tambah
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        {tasks.length === 0 && (
          <p className="py-6 text-center text-sm text-slate-400">
            Belum ada task
          </p>
        )}
      </div>
    </section>
  );
}