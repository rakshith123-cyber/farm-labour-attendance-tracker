import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useAppLock } from '../hooks/useAppLock';
import { toast } from 'sonner';

export default function LockScreenPage() {
  const { unlock } = useAppLock();
  const [passcode, setPasscode] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      toast.error('Please enter passcode');
      return;
    }

    setIsUnlocking(true);
    try {
      const success = await unlock(passcode);
      if (!success) {
        toast.error('Incorrect passcode');
        setPasscode('');
      }
    } catch (error) {
      toast.error('Failed to unlock');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Lock className="h-12 w-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">App Locked</CardTitle>
          <CardDescription className="text-base">Enter your passcode to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passcode" className="text-base">
                Passcode
              </Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="text-base min-h-[48px]"
                autoFocus
              />
            </div>
            <Button type="submit" size="lg" className="w-full text-lg min-h-[48px]" disabled={isUnlocking}>
              {isUnlocking ? 'Unlocking...' : 'Unlock'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
