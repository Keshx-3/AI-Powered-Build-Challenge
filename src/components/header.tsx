import Link from 'next/link';
import { Activity } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex w-full items-center justify-between">
         <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-headline text-foreground text-base sm:text-lg">AI-Powered Build Challenge</span>
        </Link>
        <div className="flex items-center gap-2">
         <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
