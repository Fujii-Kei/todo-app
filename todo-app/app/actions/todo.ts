'use server';

import prisma from '@/lib/prisma';

export async function createTodo(title: string, description?: string) {
  await prisma.todo.create({
    data: {
      title,
      description,
    },
  });
}

export async function getTodos() {
  return await prisma.todo.findMany({
    orderBy: {
      createdAt: 'asc', // created_at の昇順で取得
    },
  });
}

export async function updateTodo(id: number, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed },
  });
}

export async function editTodo(id: number, title: string, description?: string) {
  await prisma.todo.update({
    where: { id },
    data: { title, description },
  });
}

export async function deleteTodo(id: number) {
  await prisma.todo.delete({
    where: { id },
  });
}