"use client";

import { FormEvent, useState } from "react";
import { columns, initialTasks } from "../../lib/dummy-data";
import { ColumnId, Priority, Task } from "../../types/kanban";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import Column from "./coloum";

/* ---------- Form kecil untuk tambah/edit task ---------- */
interface TaskFormProps {
  initial: Task | null;
  defaultColumn: ColumnId;
  onSubmit: (data: Omit<Task, "id">) => void;
  onCancel: () => void;
}

function TaskForm({ initial, defaultColumn, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [columnId, setColumnId] = useState<ColumnId>(initial?.columnId ?? defaultColumn);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return; 
    onSubmit({ title: title.trim(), description: description.trim(), priority, columnId });
  };

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Judul *</label>
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Contoh: Buat halaman login"
          autoFocus
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi</label>
        <textarea
          className={inputClass}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Prioritas</label>
          <select
            className={inputClass}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Kolom</label>
          <select
            className={inputClass}
            value={columnId}
            onChange={(e) => setColumnId(e.target.value as ColumnId)}
          >
            {columns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">{initial ? "Simpan" : "Tambah"}</Button>
      </div>
    </form>
  );
}

/* ---------- Board utama ---------- */
export default function Board() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [query, setQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumn, setTargetColumn] = useState<ColumnId>("todo");

  const openAddModal = (columnId: ColumnId) => {
    setEditingTask(null);
    setTargetColumn(columnId);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (data: Omit<Task, "id">) => {
    if (editingTask) {
      // EDIT: ganti hanya task yang id-nya cocok
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...data } : t))
      );
    } else {
      // TAMBAH: buat id baru, taruh di akhir array
      setTasks((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Yakin ingin menghapus task ini?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleDropTask = (taskId: string, columnId: ColumnId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, columnId } : t))
    );
  };

  // Filter pencarian (berdasarkan judul)
  const visibleTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
    <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari task..."
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 sm:max-w-md"
      />
      <Button onClick={() => openAddModal("todo")}>+ Task Baru</Button>
    </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={visibleTasks.filter((t) => t.columnId === column.id)}
            onAdd={openAddModal}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Tambah Task"}
      >
        {/* key memaksa form di-reset tiap kali modal dibuka untuk task berbeda */}
        <TaskForm
          key={editingTask?.id ?? `new-${targetColumn}-${isModalOpen}`}
          initial={editingTask}
          defaultColumn={targetColumn}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}