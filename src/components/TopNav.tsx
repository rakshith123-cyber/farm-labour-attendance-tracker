import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Users, Calculator, Settings } from 'lucide-react';

export default function TopNav() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calendar', label: 'Calendar', icon: Calendar },
    { path: '/workers', label: 'Workers', icon: Users },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/assets/generated/tractor-icon.dim_256x256.png" alt="" className="h-8 w-8" />
            <span className="font-bold text-lg hidden sm:inline">Farm Tracker</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="default"
                    className="flex items-center gap-2 text-base font-medium min-h-[44px] px-3 sm:px-4"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px]">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
