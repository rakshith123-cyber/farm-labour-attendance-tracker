import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { WorkerId, AttendanceRecord } from '../backend';
import { calculatePayroll } from '../utils/payroll';
import { getMonthsBetween } from '../utils/dateRange';

export function usePayrollCalculator(
  workerId: WorkerId | null,
  dateRangeType: 'thisMonth' | 'custom',
  fromDate: string,
  toDate: string
) {
  const { actor, isFetching } = useActor();

  const query = useQuery({
    queryKey: ['payroll', workerId?.toString(), dateRangeType, fromDate, toDate],
    queryFn: async () => {
      if (!actor || !workerId) return null;

      let startDate: Date;
      let endDate: Date;

      if (dateRangeType === 'thisMonth') {
        const now = new Date();
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else {
        if (!fromDate || !toDate) return null;
        startDate = new Date(fromDate);
        endDate = new Date(toDate);
      }

      // Get all months in the range
      const months = getMonthsBetween(startDate, endDate);

      // Fetch attendance for all months
      const allRecords: AttendanceRecord[] = [];
      for (const monthKey of months) {
        const records = await actor.getAttendanceForMonth(workerId, monthKey);
        allRecords.push(...records);
      }

      // Filter records to the exact date range
      const filteredRecords = allRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startDate && recordDate <= endDate;
      });

      // Get worker to find daily wage
      const workers = await actor.getAllWorkers();
      const worker = workers.find((w) => w.id === workerId);
      if (!worker) return null;

      const totals = calculatePayroll(filteredRecords, Number(worker.dailyWageRupees));

      return totals;
    },
    enabled: !!actor && !isFetching && !!workerId && (dateRangeType === 'thisMonth' || (!!fromDate && !!toDate)),
  });

  return {
    totals: query.data,
    isCalculating: query.isLoading,
  };
}
