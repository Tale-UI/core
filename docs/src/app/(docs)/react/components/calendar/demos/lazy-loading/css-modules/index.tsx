'use client';
import * as React from 'react';
import clsx from 'clsx';
import { CalendarStateContext } from 'react-aria-components';
import { Calendar } from '@tale-ui/react/calendar';
import { useTimeout } from '@tale-ui/utils/useTimeout';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../../calendar.module.css';
import indexStyles from './index.module.css';

function DayPrice({
  loading,
  price,
  isDeal,
  loadingDelay,
  revealDelay,
}: {
  loading: boolean;
  price: number | null | undefined;
  isDeal: boolean;
  loadingDelay: string;
  revealDelay: string;
}) {
  if (loading) {
    return (
      <span
        className={indexStyles.Skeleton}
        style={{ animationDelay: loadingDelay }}
        aria-hidden="true"
      />
    );
  }
  if (price != null) {
    return (
      <span
        className={clsx(indexStyles.Price, isDeal && indexStyles.PriceDeal)}
        style={{ animationDelay: revealDelay }}
      >
        ${price}
      </span>
    );
  }
  return (
    <span className={indexStyles.PriceSoldOut} style={{ animationDelay: revealDelay }}>
      —
    </span>
  );
}

function CalendarContent() {
  const state = React.useContext(CalendarStateContext)!;
  const { start } = state.visibleRange;
  const monthKey = `${start.year}-${String(start.month).padStart(2, '0')}`;
  const [prices, setPrices] = React.useState<Record<string, number | null>>({});
  const [loading, setLoading] = React.useState(true);
  const timeout = useTimeout();

  React.useEffect(() => {
    const year = start.year;
    const month = start.month - 1;
    setLoading(true);
    timeout.start(800, () => {
      setPrices((prev) => ({ ...prev, ...generateMonthPrices(year, month) }));
      setLoading(false);
    });
  }, [monthKey, timeout, start.year, start.month]);

  const minPrice = React.useMemo(() => {
    const monthPrices = Object.entries(prices)
      .filter(([key]) => key.startsWith(monthKey))
      .flatMap(([, p]) => (p != null ? [p] : []));
    return monthPrices.length > 0 ? Math.min(...monthPrices) : null;
  }, [prices, monthKey]);

  return (
    <React.Fragment>
      <header className={styles.Header}>
        <Calendar.PreviousButton className={styles.DecrementMonth}>
          <ChevronLeft />
        </Calendar.PreviousButton>
        <Calendar.Heading className={styles.HeaderLabel} />
        <Calendar.NextButton className={styles.IncrementMonth}>
          <ChevronRight />
        </Calendar.NextButton>
      </header>
      <Calendar.Grid className={clsx(styles.DayGrid, indexStyles.DayGrid)}>
        <Calendar.GridHeader className={styles.DayGridHeaderRow}>
          {(day) => (
            <Calendar.GridHeaderCell
              className={clsx(styles.DayGridHeaderCell, indexStyles.DayGridHeaderCell)}
            >
              {day}
            </Calendar.GridHeaderCell>
          )}
        </Calendar.GridHeader>
        <Calendar.GridBody className={styles.DayGridBody}>
          {(date) => {
            const dateKey = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
            const inCurrentMonth = dateKey.startsWith(monthKey);
            const price = prices[dateKey];
            const isDeal = inCurrentMonth && price != null && price === minPrice;
            const daySeed = date.year * 10000 + date.month * 100 + date.day;
            const loadingDelay = `${(seededRandom(daySeed + 50) * 0.4).toFixed(3)}s`;
            const revealDelay = `${(seededRandom(daySeed + 60) * 0.5).toFixed(3)}s`;
            return (
              <Calendar.Cell date={date} className={clsx(styles.DayButton, indexStyles.DayButton)}>
                {({ formattedDate }) => (
                  <React.Fragment>
                    <span className={indexStyles.DayNumber}>{formattedDate}</span>
                    {inCurrentMonth && (
                      <DayPrice
                        loading={loading}
                        price={price}
                        isDeal={isDeal}
                        loadingDelay={loadingDelay}
                        revealDelay={revealDelay}
                      />
                    )}
                  </React.Fragment>
                )}
              </Calendar.Cell>
            );
          }}
        </Calendar.GridBody>
      </Calendar.Grid>
    </React.Fragment>
  );
}

export default function FlightPriceCalendar() {
  return (
    <Calendar.Root
      className={clsx(styles.Root, indexStyles.Root)}
      aria-label="Flight departure date"
    >
      <CalendarContent />
    </Calendar.Root>
  );
}

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateMonthPrices(year: number, month: number): Record<string, number | null> {
  const prices: Record<string, number | null> = {};
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month, d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${y}-${m}-${day}`;
    const seed = year * 10000 + (month + 1) * 100 + d;
    const rand = seededRandom(seed);
    prices[dateKey] = rand < 0.15 ? null : Math.floor(79 + seededRandom(seed + 1) * 320);
  }
  return prices;
}
