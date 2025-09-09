
'use client';

import type { CryptoCurrency } from '@/lib/types';
import { useMemo, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Input } from '@/components/ui/input';
import { CryptoTable } from '@/components/crypto-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CryptoChart } from '@/components/crypto-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fetchDataAction, getAiSuggestions } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AiSuggestions } from '@/components/ai-suggestions';
import type { AiSuggestionsOutput } from '@/ai/flows/ai-suggested-filters';
import { Pagination } from '@/components/pagination';

export default function CryptoClientPage({
  initialData,
}: {
  initialData: CryptoCurrency[];
}) {
  const [data, setData] = useState<CryptoCurrency[]>(initialData);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CryptoCurrency | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestionsOutput['suggestions']>([]);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  const availableFilters = useMemo(() => ['Top Gainer', 'Top Loser', 'High Market Cap', 'High Volume'], []);

  const fetchAiSuggestions = useCallback(async (cryptoData: CryptoCurrency[]) => {
    setIsAiLoading(true);
    const result = await getAiSuggestions({
      availableFilters: availableFilters.filter(f => !activeFilters.includes(f)),
      activeFilters: activeFilters,
      cryptoData: cryptoData.map(c => ({ name: c.name, symbol: c.symbol, price: c.price, percentChange24h: c.percentChange24h, marketCap: c.marketCap, volume24h: c.volume24h })),
    });

    if (result.suggestions) {
      setAiSuggestions(result.suggestions.suggestions);
    } else if (result.error) {
      console.error(result.error);
       toast({
          variant: 'destructive',
          title: 'AI Suggestions Failed',
          description: 'Could not load AI-powered filter suggestions.',
        });
    }
    setIsAiLoading(false);
  }, [activeFilters, toast, availableFilters]);

  useEffect(() => {
    if(initialData.length > 0) {
      fetchAiSuggestions(initialData);
    } else {
      setIsAiLoading(false);
    }
  }, [initialData, fetchAiSuggestions]);


  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchDataAction();
      if (result.data && result.data.length > 0) {
        setData(currentData => {
          const newDataMap = new Map(result.data.map(coin => [coin.id, coin]));
          return currentData.map(oldCoin => {
            const newCoin = newDataMap.get(oldCoin.id);
            if (newCoin) {
              newDataMap.delete(oldCoin.id); 
              return { ...newCoin, chartData: newCoin.chartData || oldCoin.chartData };
            }
            return oldCoin;
          }).concat(Array.from(newDataMap.values())); 
        });
      } else if (result.error) {
        console.error(result.error);
        if (!result.error.includes("rate limit")) {
          toast({
            variant: 'destructive',
            title: 'Could not refresh data',
            description: 'There was an error fetching the latest cryptocurrency prices.',
          });
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const filteredData = useMemo(() => {
    let filtered = data;
    if (search) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(search.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (activeFilters.length > 0) {
      filtered = filtered.filter((coin) => {
        return activeFilters.every((filter) => {
          switch (filter) {
            case 'Top Gainer':
              return coin.percentChange24h > 0;
            case 'Top Loser':
              return coin.percentChange24h < 0;
            case 'High Market Cap':
              return coin.marketCap > 10000000000; // > $10B
            case 'High Volume':
              return coin.volume24h > 1000000000; // > $1B
            default:
              return true;
          }
        });
      });
    }
    return filtered.sort((a,b) => {
        if(activeFilters.includes('Top Gainer')) return b.percentChange24h - a.percentChange24h;
        if(activeFilters.includes('Top Loser')) return a.percentChange24h - b.percentChange24h;
        return 0;
    })
  }, [data, search, activeFilters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const StatCard = ({ title, value, subValue, change }: { title: string, value: string, subValue?: React.ReactNode, change?: number }) => (
    <div className="grid gap-1.5 p-3 rounded-lg bg-card/50">
        <span className="text-muted-foreground">{title}</span>
        <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-semibold">{value}</span>
            {change !== undefined && (
                <span className={cn('text-sm font-semibold flex items-center', change > 0 ? 'text-green-500' : 'text-red-500')}>
                    <span className='inline-flex align-middle'>{change > 0 ? '▲' : '▼'}</span> {Math.abs(change).toFixed(2)}%
                </span>
            )}
        </div>
        {subValue}
    </div>
  );

  const PriceChange = ({ value, label }: { value: number, label: string }) => (
    <div className='text-xs'>
        <span className={cn('font-semibold flex items-center', value > 0 ? 'text-green-500' : 'text-red-500')}>
            <span className='inline-flex align-middle'>{value > 0 ? '▲' : '▼'}</span> {Math.abs(value).toFixed(2)}%
        </span>
        <span className="text-muted-foreground ml-1">{label}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid w-full max-w-7xl gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-headline font-semibold">Markets</h1>
            <p className="text-muted-foreground">
              An overview of the cryptocurrency market.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or symbol..."
                        className="w-full rounded-lg bg-card pl-10"
                        value={search}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {availableFilters.map((filter) => (
                    <Button
                        key={filter}
                        variant={activeFilters.includes(filter) ? 'secondary' : 'outline'}
                        onClick={() => toggleFilter(filter)}
                        className="h-9 px-3"
                    >
                        {filter}
                    </Button>
                    ))}
                </div>
            </div>
            
            <AiSuggestions 
                suggestions={aiSuggestions} 
                onSelectFilter={toggleFilter} 
                isLoading={isAiLoading}
            />

            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((filter) => (
                    <Badge key={filter} variant="secondary" className="gap-1.5 pr-1">
                        {filter}
                        <button
                        onClick={() => toggleFilter(filter)}
                        className="rounded-full bg-background/50 p-0.5 hover:bg-background"
                        >
                        <X className="h-3 w-3" />
                        </button>
                    </Badge>
                    ))}
                </div>
            )}
              
            <CryptoTable data={paginatedData} onRowClick={setSelectedCoin} />

            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
      
      <Dialog
        open={!!selectedCoin}
        onOpenChange={(open) => !open && setSelectedCoin(null)}
      >
        <DialogContent className="sm:max-w-3xl p-0">
          {selectedCoin && (
            <>
              <DialogHeader className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  <Image
                    src={selectedCoin.logo}
                    alt={selectedCoin.name}
                    width={56}
                    height={56}
                    className="rounded-full border"
                    data-ai-hint={`${selectedCoin.name} crypto`}
                  />
                  <div className="grid gap-1">
                    <DialogTitle className="font-headline text-2xl flex items-center gap-2">
                      {selectedCoin.name}
                      <span className="text-lg font-medium text-muted-foreground">{selectedCoin.symbol}</span>
                    </DialogTitle>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold">
                        ${selectedCoin.price.toLocaleString()}
                      </p>
                      <span
                        className={cn(
                          'font-semibold flex items-center',
                          selectedCoin.percentChange24h > 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        )}
                      >
                       <span className='inline-flex align-middle'> {selectedCoin.percentChange24h > 0 ? '▲' : '▼'}</span>
                        {Math.abs(selectedCoin.percentChange24h).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                   <div className="ml-auto text-sm text-muted-foreground pt-1">
                    Rank #{selectedCoin.rank}
                  </div>
                </div>
              </DialogHeader>
              <Separator />
              <div className="grid gap-4 md:gap-6 p-4 md:p-6">
                <div className="h-60 md:h-80 -mx-4 md:-mx-6 -mt-4 md:-mt-6">
                    <CryptoChart data={selectedCoin.chartData} percentChange={selectedCoin.percentChange24h} />
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <StatCard 
                        title="Market Cap" 
                        value={`$${selectedCoin.marketCap.toLocaleString()}`} 
                        change={selectedCoin.percentChange24h}
                    />
                    <StatCard 
                        title="Volume (24h)" 
                        value={`$${selectedCoin.volume24h.toLocaleString()}`} 
                        subValue={
                            <div className='flex items-center text-xs'>
                                <span className={cn('font-semibold flex items-center mr-1', selectedCoin.volumeChange24h > 0 ? 'text-green-500' : 'text-red-500')}>
                                    <span className='inline-flex align-middle'>{selectedCoin.volumeChange24h > 0 ? '▲' : '▼'}</span>
                                    {Math.abs(selectedCoin.volumeChange24h).toFixed(2)}%
                                </span>
                                <span className="text-muted-foreground hidden sm:inline-block">vs prev 24h</span>
                            </div>
                        }
                    />
                     <StatCard 
                        title="FDV" 
                        value={`$${selectedCoin.fullyDilutedValuation.toLocaleString()}`}
                    />

                    <StatCard 
                        title="Circulating Supply" 
                        value={`${selectedCoin.circulatingSupply.toLocaleString()} ${selectedCoin.symbol}`} 
                    />
                    <div className="col-span-full md:col-span-2 flex gap-2 pt-2 border-t mt-2">
                        <PriceChange value={selectedCoin.percentChange1h} label="1h" />
                        <PriceChange value={selectedCoin.percentChange24h} label="24h" />
                        <PriceChange value={selectedCoin.percentChange7d} label="7d" />
                    </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
