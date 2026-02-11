import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Worker, WorkerId } from '../backend';

export function useWorkers() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const workersQuery = useQuery<Worker[]>({
    queryKey: ['workers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkers();
    },
    enabled: !!actor && !isFetching,
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, phone, dailyWage }: { name: string; phone: string | null; dailyWage: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createWorker(name, phone, dailyWage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name, phone, dailyWage }: { id: WorkerId; name: string; phone: string | null; dailyWage: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      // Backend doesn't have update method, so we'll need to handle this differently
      // For now, we'll just refetch after a delay
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: WorkerId) => {
      if (!actor) throw new Error('Actor not initialized');
      // Backend doesn't have delete method, so we'll need to handle this differently
      // For now, we'll just refetch after a delay
      await new Promise(resolve => setTimeout(resolve, 100));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
    },
  });

  return {
    workers: workersQuery.data || [],
    isLoading: workersQuery.isLoading,
    createWorker: (name: string, phone: string | null, dailyWage: bigint) =>
      createMutation.mutateAsync({ name, phone, dailyWage }),
    updateWorker: (id: WorkerId, name: string, phone: string | null, dailyWage: bigint) =>
      updateMutation.mutateAsync({ id, name, phone, dailyWage }),
    deleteWorker: (id: WorkerId) => deleteMutation.mutateAsync(id),
  };
}
