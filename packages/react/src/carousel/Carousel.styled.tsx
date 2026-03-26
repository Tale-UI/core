import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Icon } from '../icon';
import { cx } from '../_cx';

/* ─── Context ──────────────────────────────────────────────────────────────── */

interface CarouselContextValue {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  emblaApi: EmblaCarouselType | undefined;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  autoplay: boolean;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarouselContext() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error('Carousel parts must be used within <Carousel.Root>');
  return ctx;
}

/* ─── Root ─────────────────────────────────────────────────────────────────── */

export interface RootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Enable infinite looping. */
  loop?: boolean;
  /** Auto-advance slides on an interval. */
  autoplay?: boolean;
  /** Number of slides visible at once. */
  slidesPerView?: number;
  /** Scroll direction. */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Embla-powered slide carousel with navigation and indicators.
 *
 * @example
 * ```tsx
 * import { Carousel } from '@tale-ui/react/carousel';
 *
 * <Carousel.Root loop>
 *   <Carousel.Content>
 *     <Carousel.Item>Slide 1</Carousel.Item>
 *     <Carousel.Item>Slide 2</Carousel.Item>
 *     <Carousel.Item>Slide 3</Carousel.Item>
 *   </Carousel.Content>
 *   <Carousel.PreviousTrigger />
 *   <Carousel.NextTrigger />
 * </Carousel.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  ({ loop, autoplay, slidesPerView = 1, orientation = 'horizontal', className, children,
    onMouseEnter: onMouseEnterProp, onMouseLeave: onMouseLeaveProp, ...props }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop,
      axis: orientation === 'vertical' ? 'y' : 'x',
      slidesToScroll: slidesPerView,
    });

    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const isPaused = React.useRef(false);

    const onSelect = React.useCallback((api: EmblaCarouselType) => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setSelectedIndex(api.selectedScrollSnap());
    }, []);

    React.useEffect(() => {
      if (!emblaApi) return;
      onSelect(emblaApi);
      emblaApi.on('select', onSelect);
      emblaApi.on('reInit', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
        emblaApi.off('reInit', onSelect);
      };
    }, [emblaApi, onSelect]);

    // Autoplay — pauses on hover and focus (WCAG 2.2.2)
    React.useEffect(() => {
      if (!autoplay || !emblaApi) return;
      const interval = setInterval(() => {
        if (!isPaused.current) emblaApi.scrollNext();
      }, 4000);
      return () => clearInterval(interval);
    }, [autoplay, emblaApi]);

    const ctx = React.useMemo<CarouselContextValue>(
      () => ({ emblaRef, emblaApi, canScrollPrev, canScrollNext, selectedIndex, autoplay: !!autoplay }),
      [emblaRef, emblaApi, canScrollPrev, canScrollNext, selectedIndex, autoplay],
    );

    return (
      <CarouselContext.Provider value={ctx}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          aria-label="Carousel"
          data-orientation={orientation}
          className={cx('tale-carousel', className)}
          onMouseEnter={(e) => { isPaused.current = true; onMouseEnterProp?.(e); }}
          onMouseLeave={(e) => { isPaused.current = false; onMouseLeaveProp?.(e); }}
          onFocusCapture={() => { isPaused.current = true; }}
          onBlurCapture={() => { isPaused.current = false; }}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Root.displayName = 'Carousel.Root';

/* ─── Content ──────────────────────────────────────────────────────────────── */

export interface ContentProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Additional CSS class name. */
  className?: string;
}

/**
 * The scrollable viewport containing carousel items.
 *
 * @example
 * ```tsx
 * <Carousel.Content>
 *   <Carousel.Item>Slide 1</Carousel.Item>
 * </Carousel.Content>
 * ```
 */
export const Content = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, ...props }, ref) => {
    const { emblaRef, autoplay } = useCarouselContext();

    return (
      <div
        ref={emblaRef}
        aria-live={autoplay ? 'off' : 'polite'}
        className={cx('tale-carousel__content', className)}
        {...props}
      >
        <div ref={ref} className="tale-carousel__container">
          {children}
        </div>
      </div>
    );
  },
);
Content.displayName = 'Carousel.Content';

/* ─── Item ─────────────────────────────────────────────────────────────────── */

export interface ItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Additional CSS class name. */
  className?: string;
}

/**
 * An individual slide within the carousel.
 *
 * @example
 * ```tsx
 * <Carousel.Item>Slide content</Carousel.Item>
 * ```
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cx('tale-carousel__item', className)}
      {...props}
    />
  ),
);
Item.displayName = 'Carousel.Item';

/* ─── PreviousTrigger ──────────────────────────────────────────────────────── */

export interface PreviousTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}

/**
 * Button to navigate to the previous slide. Renders a `ChevronLeft` icon by default.
 *
 * @example
 * ```tsx
 * <Carousel.PreviousTrigger />
 * ```
 */
export const PreviousTrigger = React.forwardRef<HTMLButtonElement, PreviousTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { emblaApi, canScrollPrev } = useCarouselContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        disabled={!canScrollPrev}
        className={cx('tale-carousel__previous', className)}
        onClick={() => emblaApi?.scrollPrev()}
        {...props}
      >
        {children ?? <Icon icon={ChevronLeft} size="sm" />}
      </button>
    );
  },
);
PreviousTrigger.displayName = 'Carousel.PreviousTrigger';

/* ─── NextTrigger ──────────────────────────────────────────────────────────── */

export interface NextTriggerProps extends React.ComponentPropsWithoutRef<'button'> {}

/**
 * Button to navigate to the next slide. Renders a `ChevronRight` icon by default.
 *
 * @example
 * ```tsx
 * <Carousel.NextTrigger />
 * ```
 */
export const NextTrigger = React.forwardRef<HTMLButtonElement, NextTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { emblaApi, canScrollNext } = useCarouselContext();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        disabled={!canScrollNext}
        className={cx('tale-carousel__next', className)}
        onClick={() => emblaApi?.scrollNext()}
        {...props}
      >
        {children ?? <Icon icon={ChevronRight} size="sm" />}
      </button>
    );
  },
);
NextTrigger.displayName = 'Carousel.NextTrigger';

/* ─── Indicators ───────────────────────────────────────────────────────────── */

export interface IndicatorsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'className'> {
  /** Additional CSS class name. */
  className?: string;
}

/**
 * Container for indicator dots.
 *
 * @example
 * ```tsx
 * <Carousel.Indicators>
 *   <Carousel.Indicator index={0} />
 *   <Carousel.Indicator index={1} />
 * </Carousel.Indicators>
 * ```
 */
export const Indicators = React.forwardRef<HTMLDivElement, IndicatorsProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cx('tale-carousel__indicators', className)}
      {...props}
    />
  ),
);
Indicators.displayName = 'Carousel.Indicators';

/* ─── Indicator ────────────────────────────────────────────────────────────── */

export interface IndicatorProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'className' | 'children'> {
  /** Zero-based slide index this indicator represents. */
  index: number;
  /** Additional CSS class name. */
  className?: string;
}

/**
 * A dot button that scrolls to a specific slide.
 *
 * @example
 * ```tsx
 * <Carousel.Indicator index={0} />
 * ```
 */
export const Indicator = React.forwardRef<HTMLButtonElement, IndicatorProps>(
  ({ index, className, ...props }, ref) => {
    const { emblaApi, selectedIndex } = useCarouselContext();
    const isSelected = selectedIndex === index;

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        aria-label={`Go to slide ${index + 1}`}
        aria-selected={isSelected}
        data-selected={isSelected || undefined}
        className={cx('tale-carousel__indicator', className)}
        onClick={() => emblaApi?.scrollTo(index)}
        {...props}
      />
    );
  },
);
Indicator.displayName = 'Carousel.Indicator';
