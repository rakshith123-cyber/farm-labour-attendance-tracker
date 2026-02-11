import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IndianRupee, Calendar as CalendarIcon } from 'lucide-react';
import { useWorkers } from '../hooks/useWorkers';
import { usePayrollCalculator } from '../hooks/usePayrollCalculator';

export default function CalculatorPage() {
  const { workers, isLoading } = useWorkers();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('');
  const [dateRangeType, setDateRangeType] = useState<'thisMonth' | 'custom'>('thisMonth');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [advancePaid, setAdvancePaid] = useState('0');

  const { totals, isCalculating } = usePayrollCalculator(
    selectedWorkerId ? BigInt(selectedWorkerId) : null,
    dateRangeType,
    fromDate,
    toDate
  );

  const selectedWorker = workers.find((w) => w.id.toString() === selectedWorkerId);
  const advanceAmount = parseFloat(advancePaid) || 0;
  const netPayable = totals ? totals.payable - advanceAmount : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Payroll Calculator</h1>
        <p className="text-lg text-muted-foreground">Calculate wages for any worker and date range</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Select Worker and Period</CardTitle>
            <CardDescription className="text-base">Choose a worker and date range to calculate wages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="worker" className="text-base font-semibold">
                Worker Name
              </Label>
              <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                <SelectTrigger id="worker" className="text-base min-h-[48px]">
                  <SelectValue placeholder="Select a worker" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading workers...
                    </SelectItem>
                  ) : workers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No workers available
                    </SelectItem>
                  ) : (
                    workers.map((worker) => (
                      <SelectItem key={worker.id.toString()} value={worker.id.toString()} className="text-base">
                        {worker.name} (₹{worker.dailyWageRupees.toString()}/day)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange" className="text-base font-semibold">
                Date Range
              </Label>
              <Select value={dateRangeType} onValueChange={(v) => setDateRangeType(v as 'thisMonth' | 'custom')}>
                <SelectTrigger id="dateRange" className="text-base min-h-[48px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thisMonth" className="text-base">
                    This Month
                  </SelectItem>
                  <SelectItem value="custom" className="text-base">
                    Custom Date Range
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRangeType === 'custom' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromDate" className="text-base font-semibold">
                    From Date
                  </Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="text-base min-h-[48px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toDate" className="text-base font-semibold">
                    To Date
                  </Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="text-base min-h-[48px]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="advance" className="text-base font-semibold">
                Advance Paid (Optional)
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="advance"
                  type="number"
                  min="0"
                  step="1"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  className="text-base min-h-[48px] pl-10"
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedWorkerId && totals && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Payroll Summary</CardTitle>
              <CardDescription className="text-base">
                {selectedWorker?.name} • Daily Wage: ₹{selectedWorker?.dailyWageRupees.toString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-attendance-full/10 p-4 rounded-lg border border-attendance-full/20">
                  <p className="text-sm text-muted-foreground mb-1">Full Days</p>
                  <p className="text-3xl font-bold text-attendance-full">{totals.fullDays}</p>
                </div>
                <div className="bg-attendance-half/10 p-4 rounded-lg border border-attendance-half/20">
                  <p className="text-sm text-muted-foreground mb-1">Half Days</p>
                  <p className="text-3xl font-bold text-attendance-half">{totals.halfDays}</p>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Effective Days</p>
                  <p className="text-3xl font-bold text-primary">{totals.effectiveDays.toFixed(1)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Payable:</span>
                  <span className="font-bold text-2xl flex items-center gap-1">
                    <IndianRupee className="h-6 w-6" />
                    {totals.payable.toFixed(2)}
                  </span>
                </div>
                {advanceAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-lg text-muted-foreground">
                      <span>Advance Paid:</span>
                      <span className="flex items-center gap-1">
                        - <IndianRupee className="h-5 w-5" />
                        {advanceAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xl pt-3 border-t border-dashed">
                      <span className="font-bold">Net Payable:</span>
                      <span className="font-bold text-3xl flex items-center gap-1 text-primary">
                        <IndianRupee className="h-7 w-7" />
                        {netPayable.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {!selectedWorkerId && (
          <Card className="bg-muted/50">
            <CardContent className="py-12 text-center">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">Select a worker to calculate wages</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
