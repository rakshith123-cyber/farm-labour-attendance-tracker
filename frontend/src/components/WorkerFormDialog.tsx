import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWorkers } from '../hooks/useWorkers';
import type { Worker } from '../backend';
import { toast } from 'sonner';

interface WorkerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worker: Worker | null;
}

export default function WorkerFormDialog({ open, onOpenChange, worker }: WorkerFormDialogProps) {
  const { createWorker, updateWorker } = useWorkers();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyWage, setDailyWage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (worker) {
      setName(worker.name);
      setPhone(worker.phone || '');
      setDailyWage(worker.dailyWageRupees.toString());
    } else {
      setName('');
      setPhone('');
      setDailyWage('');
    }
  }, [worker, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Worker name is required');
      return;
    }
    const wage = parseInt(dailyWage);
    if (isNaN(wage) || wage <= 0) {
      toast.error('Please enter a valid daily wage');
      return;
    }

    setIsSaving(true);
    try {
      if (worker) {
        await updateWorker(worker.id, name.trim(), phone.trim() || null, BigInt(wage));
        toast.success('Worker updated successfully');
      } else {
        await createWorker(name.trim(), phone.trim() || null, BigInt(wage));
        toast.success('Worker added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(worker ? 'Failed to update worker' : 'Failed to add worker');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">{worker ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
          <DialogDescription className="text-base">
            {worker ? 'Update worker information' : 'Enter worker details to add to your list'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Worker Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter worker name"
                className="text-base min-h-[48px]"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wage" className="text-base">
                Daily Wage (Rupees) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="wage"
                type="number"
                min="1"
                step="1"
                value={dailyWage}
                onChange={(e) => setDailyWage(e.target.value)}
                placeholder="Enter daily wage in ₹"
                className="text-base min-h-[48px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="text-base min-h-[44px]">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving} className="text-base min-h-[44px]">
              {isSaving ? 'Saving...' : worker ? 'Update Worker' : 'Add Worker'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
