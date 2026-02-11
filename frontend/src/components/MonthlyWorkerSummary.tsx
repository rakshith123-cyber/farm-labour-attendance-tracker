import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IndianRupee } from 'lucide-react';
import { useAttendance } from '../hooks/useAttendance';
import { calculatePayroll } from '../utils/payroll';
import type { Worker } from '../backend';

interface MonthlyWorkerSummaryProps {
  workers: Worker[];
  year: number;
  month: number;
}

export default function MonthlyWorkerSummary({ workers, year, month }: MonthlyWorkerSummaryProps) {
  const { getAttendanceMap } = useAttendance(year, month);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-base">Worker</TableHead>
                <TableHead className="text-center font-semibold text-base">Full Days</TableHead>
                <TableHead className="text-center font-semibold text-base">Half Days</TableHead>
                <TableHead className="text-center font-semibold text-base">Effective Days</TableHead>
                <TableHead className="text-right font-semibold text-base">Total Payable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => {
                const attendanceMap = getAttendanceMap(worker.id);
                const records = Object.entries(attendanceMap).map(([date, status]) => ({
                  workerId: worker.id,
                  date,
                  status,
                }));
                const totals = calculatePayroll(records, Number(worker.dailyWageRupees));

                return (
                  <TableRow key={worker.id.toString()}>
                    <TableCell className="font-medium text-base">{worker.name}</TableCell>
                    <TableCell className="text-center text-base">
                      <span className="inline-block px-2 py-1 rounded bg-attendance-full/20 text-attendance-full font-semibold">
                        {totals.fullDays}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-base">
                      <span className="inline-block px-2 py-1 rounded bg-attendance-half/20 text-attendance-half font-semibold">
                        {totals.halfDays}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-base font-semibold">{totals.effectiveDays.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-base">
                      <div className="flex items-center justify-end gap-1 font-bold text-lg">
                        <IndianRupee className="h-5 w-5" />
                        {totals.payable.toFixed(2)}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
