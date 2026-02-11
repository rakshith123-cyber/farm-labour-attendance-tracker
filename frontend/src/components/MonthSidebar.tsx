import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSidebarProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function MonthSidebar({ selectedYear, selectedMonth, onYearChange, onMonthChange }: MonthSidebarProps) {
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      onMonthChange(12);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onMonthChange(1);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Select Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Select value={selectedYear.toString()} onValueChange={(v) => onYearChange(parseInt(v))}>
            <SelectTrigger className="text-base min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()} className="text-base">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Month</label>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth} className="min-h-[44px] min-w-[44px]">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Select value={selectedMonth.toString()} onValueChange={(v) => onMonthChange(parseInt(v))}>
              <SelectTrigger className="flex-1 text-base min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={month} value={(index + 1).toString()} className="text-base">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleNextMonth} className="min-h-[44px] min-w-[44px]">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong>Selected:</strong>
            <br />
            {MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
