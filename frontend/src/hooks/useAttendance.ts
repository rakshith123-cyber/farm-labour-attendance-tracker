import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { AttendanceRecord, WorkerId } from '../backend';
import { AttendanceStatus } from '../backend';

export function useAttendance(year: number, month: number) {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const monthKey = `${year}-${String(month).padStart(2, '0')}`;

  const attendanceQuery = useQuery<AttendanceRecord[]>({
    queryKey: ['attendance', monthKey],
    queryFn: async () => {
      if (!actor) return [];
      // We need to fetch for all workers - backend doesn't support fetching all at once
      // So we'll return empty for now and fetch per worker as needed
      return [];
    },
    enabled: !!actor && !isFetching && year > 0 && month > 0,
  });

  const setAttendanceMutation = useMutation({
    mutationFn: async ({ workerId, date, status }: { workerId: WorkerId; date: string; status: AttendanceStatus }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setAttendance(workerId, date, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  const clearAttendanceMutation = useMutation({
    mutationFn: async ({ workerId, date }: { workerId: WorkerId; date: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.clearAttendance(workerId, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });

  // Fetch attendance for a specific worker
  const useWorkerAttendance = (workerId: WorkerId) => {
    return useQuery<AttendanceRecord[]>({
      queryKey: ['attendance', monthKey, workerId.toString()],
      queryFn: async () => {
        if (!actor) return [];
        return actor.getAttendanceForMonth(workerId, monthKey);
      },
      enabled: !!actor && !isFetching && year > 0 && month > 0,
    });
  };

  const getAttendanceMap = (workerId: WorkerId): Record<string, AttendanceStatus> => {
    const workerData = queryClient.getQueryData<AttendanceRecord[]>(['attendance', monthKey, workerId.toString()]);
    if (!workerData) {
      // Trigger fetch
      queryClient.prefetchQuery({
        queryKey: ['attendance', monthKey, workerId.toString()],
        queryFn: async () => {
          if (!actor) return [];
          return actor.getAttendanceForMonth(workerId, monthKey);
        },
      });
      return {};
    }
    const map: Record<string, AttendanceStatus> = {};
    workerData.forEach((record) => {
      map[record.date] = record.status;
    });
    return map;
  };

  return {
    attendance: attendanceQuery.data || [],
    isLoading: attendanceQuery.isLoading,
    setAttendance: (workerId: WorkerId, date: string, status: AttendanceStatus) =>
      setAttendanceMutation.mutateAsync({ workerId, date, status }),
    clearAttendance: (workerId: WorkerId, date: string) =>
      clearAttendanceMutation.mutateAsync({ workerId, date }),
    getAttendanceMap,
    useWorkerAttendance,
  };
}
