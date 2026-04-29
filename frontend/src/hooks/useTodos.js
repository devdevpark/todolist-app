import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  uncompleteTodo,
} from '@/api/todo-api';

export function useTodos(filters = {}) {
  return useQuery({
    queryKey: ['todos', filters],
    queryFn: () => getTodos(filters),
  });
}

export function useTodo(id) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodoById(id),
    enabled: !!id,
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateTodo(data.id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', variables.id] });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useCompleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useUncompleteTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uncompleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
