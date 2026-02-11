import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, UserPlus, Leaf } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <img src="/assets/generated/leaf-icon.dim_256x256.png" alt="" className="h-24 w-24" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground leading-tight">
          Farm Labour Attendance Tracker
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground">For my father and farmers</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Link to="/calendar">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">View Calendar</CardTitle>
              </div>
              <CardDescription className="text-base">
                Mark daily attendance and see worker schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full text-lg min-h-[48px]">
                Open Calendar
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link to="/workers">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-2 hover:border-primary">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <UserPlus className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Add New Worker</CardTitle>
              </div>
              <CardDescription className="text-base">Manage your farm workers and their wages</CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" className="w-full text-lg min-h-[48px]">
                Manage Workers
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-xl">Quick Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-base">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-attendance-full flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
            <p>
              <strong>Red (Full Day):</strong> Worker worked 8+ hours
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-attendance-half flex items-center justify-center text-white font-bold text-sm">
              H
            </div>
            <p>
              <strong>Green (Half Day):</strong> Worker worked half day
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-attendance-morning flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <p>
              <strong>Black (Morning-Evening):</strong> Worker worked morning to evening
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-border bg-background"></div>
            <p>
              <strong>White (Absent):</strong> Worker did not work
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
