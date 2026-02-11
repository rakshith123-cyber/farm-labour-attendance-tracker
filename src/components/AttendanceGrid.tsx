import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AttendanceCellSelector from './AttendanceCellSelector';
import { useAttendance } from '../hooks/useAttendance';
import type { Worker } from '../backend';
import { AttendanceStatus } from '../backend';

interface AttendanceGridProps {
  workers: Worker[];
  year: number;
  month: number;
}

export default function AttendanceGrid({ workers, year, month }: AttendanceGridProps) {
  const { getAttendanceMap } = useAttendance(year, month);
  const [selectedCell, setSelectedCell] = useState<{ workerId: bigint; date: string } | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getStatusColor = (status: AttendanceStatus | undefined) => {
    if (!status) return 'bg-background border-2 border-border';
    switch (status) {
      case AttendanceStatus.full:
        return 'bg-attendance-full';
      case AttendanceStatus.half:
        return 'bg-attendance-half';
      case AttendanceStatus.morningEvening:
        return 'bg-attendance-morning';
      case AttendanceStatus.absent:
        return 'bg-background border-2 border-border';
      default:
        return 'bg-background border-2 border-border';
    }
  };

  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-20 bg-card font-bold text-base min-w-[150px] border-r-2">
                Worker Name
              </TableHead>
              {days.map((day) => (
                <TableHead key={day} className="text-center font-semibold text-base min-w-[48px]">
                  {day}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {workers.map((worker) => {
              const attendanceMap = getAttendanceMap(worker.id);
              return (
                <TableRow key={worker.id.toString()}>
                  <TableCell className="sticky left-0 z-10 bg-card font-medium text-base border-r-2">
                    {worker.name}
                  </TableCell>
                  {days.map((day) => {
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = attendanceMap[dateStr];
                    return (
                      <TableCell key={day} className="p-1">
                        <button
                          onClick={() => setSelectedCell({ workerId: worker.id, date: dateStr })}
                          className={`w-full h-12 rounded transition-all hover:scale-105 hover:shadow-md ${getStatusColor(
                            status
                          )}`}
                          aria-label={`Mark attendance for ${worker.name} on day ${day}`}
                        />
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {selectedCell && (
        <AttendanceCellSelector
          workerId={selectedCell.workerId}
          date={selectedCell.date}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
}
