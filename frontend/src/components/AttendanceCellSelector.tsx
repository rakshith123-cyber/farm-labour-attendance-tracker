import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAttendance } from '../hooks/useAttendance';
import { AttendanceStatus } from '../backend';
import { toast } from 'sonner';

interface AttendanceCellSelectorProps {
  workerId: bigint;
  date: string;
  onClose: () => void;
}

export default function AttendanceCellSelector({ workerId, date, onClose }: AttendanceCellSelectorProps) {
  const { setAttendance } = useAttendance(0, 0);

  const handleSelect = async (status: AttendanceStatus) => {
    try {
      await setAttendance(workerId, date, status);
      
      // Show specific toast message based on status
      const messages = {
        [AttendanceStatus.full]: 'Marked full day',
        [AttendanceStatus.half]: 'Marked half day',
        [AttendanceStatus.morningEvening]: 'Marked morning-evening',
        [AttendanceStatus.absent]: 'Marked absent',
      };
      
      toast.success(messages[status]);
      onClose();
    } catch (error) {
      toast.error('Failed to save attendance');
    }
  };

  const options = [
    {
      label: 'Full Day',
      description: '8+ hours',
      status: AttendanceStatus.full,
      color: 'bg-attendance-full hover:bg-attendance-full/90',
    },
    {
      label: 'Half Day',
      description: 'Half day work',
      status: AttendanceStatus.half,
      color: 'bg-attendance-half hover:bg-attendance-half/90',
    },
    {
      label: 'Morning-Evening',
      description: 'Morning to evening',
      status: AttendanceStatus.morningEvening,
      color: 'bg-attendance-morning hover:bg-attendance-morning/90',
    },
    {
      label: 'Absent',
      description: 'Did not work',
      status: AttendanceStatus.absent,
      color: 'bg-background hover:bg-muted border-2 border-border',
    },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">Mark Attendance</DialogTitle>
          <DialogDescription className="text-base">
            Select attendance status for {new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' })}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {options.map((option) => (
            <Button
              key={option.label}
              onClick={() => handleSelect(option.status)}
              variant="outline"
              className={`h-auto py-4 px-4 justify-start text-left ${option.color} text-white font-semibold text-base min-h-[60px]`}
            >
              <div className="flex flex-col">
                <span className="text-lg">{option.label}</span>
                <span className="text-sm opacity-90">{option.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
