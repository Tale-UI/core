import * as React from 'react';
import { cx } from '../_cx';

// ── Context ──────────────────────────────────────────────────────────────────

interface ScrollAreaContextValue {
  viewportRef: React.RefObject<HTMLDivElement | null>;
}

const ScrollAreaContext = React.createContext<ScrollAreaContextValue>({
  viewportRef: { current: null },
});

interface ScrollbarContextValue {
  thumbRef: React.RefObject<HTMLDivElement | null>;
  onThumbPointerDown: (event: React.PointerEvent) => void;
}

const ScrollbarContext = React.createContext<ScrollbarContextValue | null>(null);

// ── Root ─────────────────────────────────────────────────────────────────────

/**
 * A scrollable container with custom scrollbars.
 *
 * @example
 * ```tsx
 * import { ScrollArea } from '@tale-ui/react/scroll-area';
 *
 * <ScrollArea.Root style={{ height: 200 }}>
 *   <ScrollArea.Viewport>
 *     <ScrollArea.Content>
 *       <p>Scrollable content here...</p>
 *     </ScrollArea.Content>
 *   </ScrollArea.Viewport>
 *   <ScrollArea.Scrollbar orientation="vertical">
 *     <ScrollArea.Thumb />
 *   </ScrollArea.Scrollbar>
 * </ScrollArea.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const viewportRef = React.useRef<HTMLDivElement>(null);
    const ctx = React.useMemo(() => ({ viewportRef }), []);
    return (
      <ScrollAreaContext.Provider value={ctx}>
        <div ref={ref} className={cx('tale-scroll-area', className)} {...props} />
      </ScrollAreaContext.Provider>
    );
  },
);
Root.displayName = 'ScrollArea.Root';

// ── Viewport ─────────────────────────────────────────────────────────────────

export const Viewport = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { viewportRef } = React.useContext(ScrollAreaContext);
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        (viewportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') {ref(node);}
        else if (ref) {(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;}
      },
      [ref, viewportRef],
    );
    return (
      <div ref={mergedRef} className={cx('tale-scroll-area__viewport', className)} {...props} />
    );
  },
);
Viewport.displayName = 'ScrollArea.Viewport';

// ── Scrollbar ────────────────────────────────────────────────────────────────

export const Scrollbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'vertical', children, ...props }, ref) => {
  const { viewportRef } = React.useContext(ScrollAreaContext);
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const isVertical = orientation === 'vertical';

  const update = React.useCallback(() => {
    const viewport = viewportRef.current;
    const scrollbar = scrollbarRef.current;
    const thumb = thumbRef.current;
    if (!viewport || !scrollbar || !thumb) {return;}

    if (isVertical) {
      const ratio = viewport.clientHeight / viewport.scrollHeight;
      if (ratio >= 1) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = '';
      const trackHeight = scrollbar.clientHeight;
      const thumbHeight = Math.max(ratio * trackHeight, 20);
      const scrollRatio = viewport.scrollTop / (viewport.scrollHeight - viewport.clientHeight);
      const thumbTop = scrollRatio * (trackHeight - thumbHeight);
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${thumbTop}px)`;
    } else {
      const ratio = viewport.clientWidth / viewport.scrollWidth;
      if (ratio >= 1) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = '';
      const trackWidth = scrollbar.clientWidth;
      const thumbWidth = Math.max(ratio * trackWidth, 20);
      const scrollRatio = viewport.scrollLeft / (viewport.scrollWidth - viewport.clientWidth);
      const thumbLeft = scrollRatio * (trackWidth - thumbWidth);
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${thumbLeft}px)`;
    }
  }, [viewportRef, isVertical]);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {return;}

    viewport.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(viewport);
    if (viewport.firstElementChild) {
      ro.observe(viewport.firstElementChild);
    }

    update();

    return () => {
      viewport.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [viewportRef, update]);

  const onTrackClick = React.useCallback(
    (event: React.PointerEvent) => {
      const viewport = viewportRef.current;
      const scrollbar = scrollbarRef.current;
      const thumb = thumbRef.current;
      if (!viewport || !scrollbar || !thumb || thumb.contains(event.target as Node)) {return;}

      const rect = scrollbar.getBoundingClientRect();
      if (isVertical) {
        const clickRatio = (event.clientY - rect.top) / rect.height;
        viewport.scrollTop = clickRatio * (viewport.scrollHeight - viewport.clientHeight);
      } else {
        const clickRatio = (event.clientX - rect.left) / rect.width;
        viewport.scrollLeft = clickRatio * (viewport.scrollWidth - viewport.clientWidth);
      }
    },
    [viewportRef, isVertical],
  );

  const onThumbPointerDown = React.useCallback(
    (event: React.PointerEvent) => {
      const viewport = viewportRef.current;
      const scrollbar = scrollbarRef.current;
      const thumb = thumbRef.current;
      if (!viewport || !scrollbar || !thumb) {return;}

      event.preventDefault();
      event.stopPropagation();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);

      const startPos = isVertical ? event.clientY : event.clientX;
      const startScroll = isVertical ? viewport.scrollTop : viewport.scrollLeft;
      const trackSize = isVertical ? scrollbar.clientHeight : scrollbar.clientWidth;
      const thumbSize = isVertical ? thumb.offsetHeight : thumb.offsetWidth;
      const maxScroll = isVertical
        ? viewport.scrollHeight - viewport.clientHeight
        : viewport.scrollWidth - viewport.clientWidth;
      const ratio = maxScroll / (trackSize - thumbSize);

      const onMove = (ev: PointerEvent) => {
        const delta = (isVertical ? ev.clientY : ev.clientX) - startPos;
        if (isVertical) {
          viewport.scrollTop = startScroll + delta * ratio;
        } else {
          viewport.scrollLeft = startScroll + delta * ratio;
        }
      };

      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
      };

      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    },
    [viewportRef, isVertical],
  );

  const mergedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollbarRef.current = node;
      if (typeof ref === 'function') {ref(node);}
      else if (ref) {(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;}
    },
    [ref],
  );

  const ctx = React.useMemo(
    () => ({ thumbRef, onThumbPointerDown }),
    [onThumbPointerDown],
  );

  return (
    <ScrollbarContext.Provider value={ctx}>
      <div
        ref={mergedRef}
        data-orientation={orientation}
        className={cx('tale-scroll-area__scrollbar', className)}
        onPointerDown={onTrackClick}
        {...props}
      >
        {children}
      </div>
    </ScrollbarContext.Provider>
  );
});
Scrollbar.displayName = 'ScrollArea.Scrollbar';

// ── Thumb ────────────────────────────────────────────────────────────────────

export const Thumb = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const scrollbar = React.useContext(ScrollbarContext);
    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        if (scrollbar) {
          (scrollbar.thumbRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        if (typeof ref === 'function') {ref(node);}
        else if (ref) {(ref as React.MutableRefObject<HTMLDivElement | null>).current = node;}
      },
      [ref, scrollbar],
    );

    return (
      <div
        ref={mergedRef}
        className={cx('tale-scroll-area__thumb', className)}
        onPointerDown={scrollbar?.onThumbPointerDown}
        {...props}
      />
    );
  },
);
Thumb.displayName = 'ScrollArea.Thumb';

// ── Corner ───────────────────────────────────────────────────────────────────

export const Corner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__corner', className)} {...props} />
  ),
);
Corner.displayName = 'ScrollArea.Corner';

// ── Content ──────────────────────────────────────────────────────────────────

export const Content = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx('tale-scroll-area__content', className)} {...props} />
  ),
);
Content.displayName = 'ScrollArea.Content';
