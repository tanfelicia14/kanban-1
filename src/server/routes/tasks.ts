import { Hono } from 'hono';
import { tasks } from '@/data/tasks';
import type { CreateTaskInput, Task, UpdateTaskInput } from '@/types/task';

const taskRoutes = new Hono();

taskRoutes.get('/', (c) => {
  return c.json(tasks, 200);
});

taskRoutes.post('/', async (c) => {
  const body = await c.req.json<CreateTaskInput>();

  if (!body.title || typeof body.title !== 'string') {
    return c.json({ error: 'Title is required' }, 400);
  }

  const newTask: Task = {
    id: crypto.randomUUID(),
    title: body.title.trim(),
    ...(body.description !== undefined ? { description: body.description } : {}),
    status: body.status ?? 'todo',
    priority: body.priority ?? 'medium',
  };

  tasks.push(newTask);
  return c.json(newTask, 201);
});

taskRoutes.patch('/:id', async (c) => {
  const id = c.req.param('id');
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return c.json({ error: 'Task not found' }, 404);
  }

  const body = await c.req.json<UpdateTaskInput>();
  const currentTask = tasks[index];

  const updatedTask: Task = {
    ...currentTask,
    ...(body.title !== undefined ? { title: body.title.trim() } : {}),
    ...(body.description !== undefined ? { description: body.description } : {}),
    ...(body.status !== undefined ? { status: body.status } : {}),
    ...(body.priority !== undefined ? { priority: body.priority } : {}),
  };

  tasks[index] = updatedTask;
  return c.json(updatedTask, 200);
});

taskRoutes.delete('/:id', (c) => {
  const id = c.req.param('id');
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return c.json({ error: 'Task not found' }, 404);
  }

  const [removedTask] = tasks.splice(index, 1);
  return c.json({ message: 'Task deleted successfully', task: removedTask }, 200);
});

export default taskRoutes;
