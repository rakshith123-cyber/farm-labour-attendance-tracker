import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, Shield } from 'lucide-react';
import { useAppLock } from '../hooks/useAppLock';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { isEnabled, setPasscode, toggleLock } = useAppLock();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePasscode = async () => {
    if (newPasscode.length < 4) {
      toast.error('Passcode must be at least 4 characters');
      return;
    }
    if (newPasscode !== confirmPasscode) {
      toast.error('Passcodes do not match');
      return;
    }

    setIsSaving(true);
    try {
      await setPasscode(newPasscode);
      toast.success('Passcode saved successfully');
      setIsDialogOpen(false);
      setNewPasscode('');
      setConfirmPasscode('');
    } catch (error) {
      toast.error('Failed to save passcode');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-lg text-muted-foreground">Manage app security and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">App Lock</CardTitle>
              <CardDescription className="text-base">Protect your data with a passcode</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="appLock" className="text-base font-semibold">
                Enable App Lock
              </Label>
              <p className="text-sm text-muted-foreground">Require passcode to access the app</p>
            </div>
            <Switch id="appLock" checked={isEnabled} onCheckedChange={toggleLock} className="scale-125" />
          </div>

          {isEnabled && (
            <div className="pt-4 border-t">
              <Button size="lg" onClick={() => setIsDialogOpen(true)} className="text-base min-h-[48px]">
                <Lock className="mr-2 h-5 w-5" />
                {isEnabled ? 'Change Passcode' : 'Set Passcode'}
              </Button>
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> When app lock is enabled, you will need to enter your passcode each time you open
              the app. Make sure to remember your passcode.
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Set Passcode</DialogTitle>
            <DialogDescription className="text-base">
              Create a passcode to protect your farm data. Minimum 4 characters.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPasscode" className="text-base">
                New Passcode
              </Label>
              <Input
                id="newPasscode"
                type="password"
                value={newPasscode}
                onChange={(e) => setNewPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="text-base min-h-[48px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPasscode" className="text-base">
                Confirm Passcode
              </Label>
              <Input
                id="confirmPasscode"
                type="password"
                value={confirmPasscode}
                onChange={(e) => setConfirmPasscode(e.target.value)}
                placeholder="Re-enter passcode"
                className="text-base min-h-[48px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="text-base min-h-[44px]">
              Cancel
            </Button>
            <Button onClick={handleSavePasscode} disabled={isSaving} className="text-base min-h-[44px]">
              {isSaving ? 'Saving...' : 'Save Passcode'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
