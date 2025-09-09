
'use client';

import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from './ui/skeleton';

interface AiSuggestionsProps {
  suggestions: { filter: string; reason: string }[];
  onSelectFilter: (filter: string) => void;
  isLoading: boolean;
}

export function AiSuggestions({
  suggestions,
  onSelectFilter,
  isLoading,
}: AiSuggestionsProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-full max-w-sm" />;
  }
  
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
        <Wand2 className="h-4 w-4" />
        AI Suggestions:
      </p>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          {suggestions.map(({ filter, reason }) => (
            <Tooltip key={filter}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectFilter(filter)}
                  className="h-9"
                >
                  {filter}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{reason}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
