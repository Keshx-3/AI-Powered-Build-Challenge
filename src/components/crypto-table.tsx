
'use client';

import Image from 'next/image';
import type { CryptoCurrency } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CryptoChart } from './crypto-chart';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CryptoTableProps {
  data: CryptoCurrency[];
  onRowClick: (coin: CryptoCurrency) => void;
}

const PriceChangeCell = ({ value }: { value: number }) => (
    <span
        className={cn(
        'font-semibold flex items-center justify-end',
        value > 0
            ? 'text-green-500'
            : 'text-red-500'
        )}
    >
        {value > 0 ? '▲' : '▼'}<span className='ml-1'>{Math.abs(value).toFixed(2)}%</span>
    </span>
);

const InfoTooltip = ({ children, text }: { children: React.ReactNode, text: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-end gap-1.5 cursor-help">
          {children}
          <Info className="h-3.5 w-3.5 text-muted-foreground/70" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="max-w-xs">{text}</div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);


export function CryptoTable({ data, onRowClick }: CryptoTableProps) {
  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-12 sticky left-0 bg-card z-10 px-2 sm:px-4">#</TableHead>
                <TableHead className="sticky left-12 bg-card z-10 min-w-[150px]">Name</TableHead>
                <TableHead className="text-right min-w-[100px]">Price</TableHead>
                <TableHead className="text-right min-w-[80px]">1h %</TableHead>
                <TableHead className="text-right min-w-[80px]">24h %</TableHead>
                <TableHead className="text-right min-w-[80px]">7d %</TableHead>
                <TableHead className="text-right min-w-[160px]">
                   <InfoTooltip text={<p>The total market value of a cryptocurrency's circulating supply. It is analogous to the free-float capitalization in the stock market.<br/><br/>Market Cap = Current Price x Circulating Supply.</p>}>
                    Market Cap
                  </InfoTooltip>
                </TableHead>
                <TableHead className="text-right min-w-[160px]">
                  <InfoTooltip text="A measure of how much of a cryptocurrency was traded in the last 24 hours.">
                    Volume(24h)
                  </InfoTooltip>
                </TableHead>
                <TableHead className="text-right min-w-[200px]">
                  <InfoTooltip text="The amount of coins that are circulating in the market and are in public hands. It is analogous to the flowing shares in the stock market.">
                    Circulating Supply
                  </InfoTooltip>
                </TableHead>
                <TableHead className="text-center w-48">Last 7 Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((coin) => (
                <TableRow
                  key={coin.id}
                  onClick={() => onRowClick(coin)}
                  className="cursor-pointer"
                >
                  <TableCell className="text-center text-muted-foreground sticky left-0 bg-card/75 backdrop-blur-sm z-10 px-2 sm:px-4">{coin.rank}</TableCell>
                  <TableCell className="sticky left-12 bg-card/75 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-3">
                      <Image
                        src={coin.logo}
                        alt={coin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        data-ai-hint={`${coin.name} crypto`}
                      />
                      <div>
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceChangeCell value={coin.percentChange1h} />
                  </TableCell>
                  <TableCell className="text-right">
                    <PriceChangeCell value={coin.percentChange24h} />
                  </TableCell>
                  <TableCell className="text-right">
                      <PriceChangeCell value={coin.percentChange7d} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${coin.marketCap.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${coin.volume24h.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {coin.circulatingSupply.toLocaleString()} {coin.symbol}
                  </TableCell>
                  <TableCell className="h-16 w-48 p-1">
                      <CryptoChart data={coin.chartData} percentChange={coin.percentChange7d} simple />
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
