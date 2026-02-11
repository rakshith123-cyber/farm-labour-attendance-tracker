import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MonthSidebar from '../components/MonthSidebar';
import AttendanceGrid from '../components/AttendanceGrid';
import MonthlyWorkerSummary from '../components/MonthlyWorkerSummary';
import { useWorkers } from '../hooks/useWorkers';

export default function CalendarPage() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const { workers, isLoading } = useWorkers();

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px]">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Attendance Calendar</h1>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      ) : workers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-xl text-muted-foreground mb-4">No workers added yet</p>
            <p className="text-base text-muted-foreground">Add workers first to mark attendance</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <MonthSidebar
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
            />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AttendanceGrid
                  workers={workers}
                  year={selectedYear}
                  month={selectedMonth}
                />
              </CardContent>
            </Card>

            <MonthlyWorkerSummary
              workers={workers}
              year={selectedYear}
              month={selectedMonth}
            />
          </div>
        </div>
      )}
    </div>
  );
}
