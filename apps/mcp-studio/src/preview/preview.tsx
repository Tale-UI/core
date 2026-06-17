/**
 * Preview runtime — runs inside the sandboxed iframe.
 *
 * Receives compiled JS (from Sucrase) via postMessage, dynamically
 * imports all @tale-ui/* components into a scope bag, then executes
 * the code and renders the exported `Example` function.
 *
 * The iframe is isolated from the Studio's state and can crash/recover
 * independently.
 */

import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import '@tale-ui/react-styles/index.css';
import '@tale-ui/charts/chart.css';

// Pre-import all commonly used Tale UI components so the generated code
// can destructure them from the `components` scope bag passed to the
// Function constructor.  Import * to avoid enumerating every named export.
import * as ButtonPkg from '@tale-ui/react/button';
import * as InputPkg from '@tale-ui/react/input';
import * as TextFieldPkg from '@tale-ui/react/text-field';
import * as TextAreaPkg from '@tale-ui/react/text-area';
import * as SelectPkg from '@tale-ui/react/select';
import * as ComboboxPkg from '@tale-ui/react/combobox';
import * as CheckboxPkg from '@tale-ui/react/checkbox';
import * as RadioPkg from '@tale-ui/react/radio';
import * as SwitchPkg from '@tale-ui/react/switch';
import * as SliderPkg from '@tale-ui/react/slider';
import * as NumberFieldPkg from '@tale-ui/react/number-field';
import * as SearchFieldPkg from '@tale-ui/react/search-field';
import * as BadgePkg from '@tale-ui/react/badge';
import * as BannerPkg from '@tale-ui/react/banner';
import * as ButtonGroupPkg from '@tale-ui/react/toggle-button';
import * as CardPkg from '@tale-ui/react/card';
import * as TabsPkg from '@tale-ui/react/tabs';
import * as AccordionPkg from '@tale-ui/react/accordion';
import * as DialogPkg from '@tale-ui/react/dialog';
import * as DrawerPkg from '@tale-ui/react/drawer';
import * as PopoverPkg from '@tale-ui/react/popover';
import * as TooltipPkg from '@tale-ui/react/tooltip';
import * as SpinnerPkg from '@tale-ui/react/spinner';
import * as ProgressBarPkg from '@tale-ui/react/progress-bar';
import * as IconPkg from '@tale-ui/react/icon';
import * as IconButtonPkg from '@tale-ui/react/icon-button';
import * as FeaturedIconPkg from '@tale-ui/react/featured-icon';
import * as AvatarPkg from '@tale-ui/react/avatar';
import * as RowPkg from '@tale-ui/react/row';
import * as ColumnPkg from '@tale-ui/react/column';
import * as TextPkg from '@tale-ui/react/text';
import * as SeparatorPkg from '@tale-ui/react/separator';
import * as RatingStarsPkg from '@tale-ui/react/rating-stars';
import * as ColorModeTogglePkg from '@tale-ui/react/color-mode-toggle';
import * as PaginationPkg from '@tale-ui/react/pagination';
import * as MenuPkg from '@tale-ui/react/menu';
import * as BreadcrumbsPkg from '@tale-ui/react/breadcrumbs';
import * as TagGroupPkg from '@tale-ui/react/tag-group';
import * as TablePkg from '@tale-ui/react/table';
import * as EmptyStatePkg from '@tale-ui/react/empty-state';
import * as MeterPkg from '@tale-ui/react/meter';
import * as FieldPkg from '@tale-ui/react/field';
import * as FormPkg from '@tale-ui/react/form';
import * as AlertDialogPkg from '@tale-ui/react/alert-dialog';
import * as AutocompletePkg from '@tale-ui/react/autocomplete';
import * as BackgroundPatternPkg from '@tale-ui/react/background-pattern';
import * as BadgeGroupPkg from '@tale-ui/react/badge-group';
import * as CalendarPkg from '@tale-ui/react/calendar';
import * as CarouselPkg from '@tale-ui/react/carousel';
import * as CheckboxGroupPkg from '@tale-ui/react/checkbox-group';
import * as ColorAreaPkg from '@tale-ui/react/color-area';
import * as ColorFieldPkg from '@tale-ui/react/color-field';
import * as ColorPickerPkg from '@tale-ui/react/color-picker';
import * as ColorSliderPkg from '@tale-ui/react/color-slider';
import * as ColorSwatchPkg from '@tale-ui/react/color-swatch';
import * as ColorSwatchPickerPkg from '@tale-ui/react/color-swatch-picker';
import * as ColorWheelPkg from '@tale-ui/react/color-wheel';
import * as ContextMenuPkg from '@tale-ui/react/context-menu';
import * as CreditCardPkg from '@tale-ui/react/credit-card';
import * as DateFieldPkg from '@tale-ui/react/date-field';
import * as DatePickerPkg from '@tale-ui/react/date-picker';
import * as DateRangePickerPkg from '@tale-ui/react/date-range-picker';
import * as DisclosurePkg from '@tale-ui/react/disclosure';
import * as DotIconPkg from '@tale-ui/react/dot-icon';
import * as DropZonePkg from '@tale-ui/react/drop-zone';
import * as FieldsetPkg from '@tale-ui/react/fieldset';
import * as FileTriggerPkg from '@tale-ui/react/file-trigger';
import * as FileUploadPkg from '@tale-ui/react/file-upload';
import * as GridListPkg from '@tale-ui/react/grid-list';
import * as HeaderNavPkg from '@tale-ui/react/header-nav';
import * as IllustrationPkg from '@tale-ui/react/illustration';
import * as ImagePkg from '@tale-ui/react/image';
import * as ImageCropperPkg from '@tale-ui/react/image-cropper';
import * as InputGroupPkg from '@tale-ui/react/input-group';
import * as InputTagsPkg from '@tale-ui/react/input-tags';
import * as IPhoneMockupPkg from '@tale-ui/react/iphone-mockup';
import * as LinkPkg from '@tale-ui/react/link';
import * as ListPkg from '@tale-ui/react/list';
import * as MenubarPkg from '@tale-ui/react/menubar';
import * as MultiSelectPkg from '@tale-ui/react/multi-select';
import * as NavigationMenuPkg from '@tale-ui/react/navigation-menu';
import * as PaginationDotPkg from '@tale-ui/react/pagination-dot';
import * as PaginationLinePkg from '@tale-ui/react/pagination-line';
import * as PaymentInputPkg from '@tale-ui/react/payment-input';
import * as PinInputPkg from '@tale-ui/react/pin-input';
import * as PreviewCardPkg from '@tale-ui/react/preview-card';
import * as ProgressCirclePkg from '@tale-ui/react/progress-circle';
import * as QRCodePkg from '@tale-ui/react/qr-code';
import * as RadioGroupPkg from '@tale-ui/react/radio-group';
import * as RangeCalendarPkg from '@tale-ui/react/range-calendar';
import * as RatingBadgePkg from '@tale-ui/react/rating-badge';
import * as ScrollAreaPkg from '@tale-ui/react/scroll-area';
import * as SectionDividerPkg from '@tale-ui/react/section-divider';
import * as SelectNativePkg from '@tale-ui/react/select-native';
import * as SidebarPkg from '@tale-ui/react/sidebar';
import * as SocialButtonPkg from '@tale-ui/react/social-button';
import * as TagSelectPkg from '@tale-ui/react/tag-select';
import * as TextEditorPkg from '@tale-ui/react/text-editor';
import * as TimeFieldPkg from '@tale-ui/react/time-field';
import * as ToolbarPkg from '@tale-ui/react/toolbar';
import * as TreePkg from '@tale-ui/react/tree';
import * as VideoPlayerPkg from '@tale-ui/react/video-player';
import * as AppStoreButtonPkg from '@tale-ui/react/app-store-button';
import * as AreaChartPkg from '@tale-ui/charts/area-chart';
import * as BarChartPkg from '@tale-ui/charts/bar-chart';
import * as LineChartPkg from '@tale-ui/charts/line-chart';
import * as PieChartPkg from '@tale-ui/charts/pie-chart';
import * as RadarChartPkg from '@tale-ui/charts/radar-chart';
import * as RadialBarChartPkg from '@tale-ui/charts/radial-bar-chart';
import * as LucideReactPkg from 'lucide-react';
import * as ReactHookFormPkg from 'react-hook-form';
import * as ChartsPkg from '@tale-ui/charts';

// Map each @tale-ui/react/* module path to its package namespace.
// Used by requireShim so Sucrase's compiled `require('...')` calls get the right exports.
// 'react' must be here: Sucrase's imports transform emits `require('react')` for JSX,
// and the fallback (SCOPE) doesn't have createElement.
const MODULE_MAP: Record<string, Record<string, unknown>> = {
  'react': React as unknown as Record<string, unknown>,
  '@tale-ui/react/button': ButtonPkg as Record<string, unknown>,
  '@tale-ui/react/input': InputPkg as Record<string, unknown>,
  '@tale-ui/react/text-field': TextFieldPkg as Record<string, unknown>,
  '@tale-ui/react/text-area': TextAreaPkg as Record<string, unknown>,
  '@tale-ui/react/select': SelectPkg as Record<string, unknown>,
  '@tale-ui/react/combobox': ComboboxPkg as Record<string, unknown>,
  '@tale-ui/react/checkbox': CheckboxPkg as Record<string, unknown>,
  '@tale-ui/react/radio': RadioPkg as Record<string, unknown>,
  '@tale-ui/react/switch': SwitchPkg as Record<string, unknown>,
  '@tale-ui/react/slider': SliderPkg as Record<string, unknown>,
  '@tale-ui/react/number-field': NumberFieldPkg as Record<string, unknown>,
  '@tale-ui/react/search-field': SearchFieldPkg as Record<string, unknown>,
  '@tale-ui/react/badge': BadgePkg as Record<string, unknown>,
  '@tale-ui/react/banner': BannerPkg as Record<string, unknown>,
  '@tale-ui/react/toggle-button': ButtonGroupPkg as Record<string, unknown>,
  '@tale-ui/react/card': CardPkg as Record<string, unknown>,
  '@tale-ui/react/tabs': TabsPkg as Record<string, unknown>,
  '@tale-ui/react/accordion': AccordionPkg as Record<string, unknown>,
  '@tale-ui/react/dialog': DialogPkg as Record<string, unknown>,
  '@tale-ui/react/drawer': DrawerPkg as Record<string, unknown>,
  '@tale-ui/react/popover': PopoverPkg as Record<string, unknown>,
  '@tale-ui/react/tooltip': TooltipPkg as Record<string, unknown>,
  '@tale-ui/react/spinner': SpinnerPkg as Record<string, unknown>,
  '@tale-ui/react/progress-bar': ProgressBarPkg as Record<string, unknown>,
  '@tale-ui/react/icon': IconPkg as Record<string, unknown>,
  '@tale-ui/react/icon-button': IconButtonPkg as Record<string, unknown>,
  '@tale-ui/react/featured-icon': FeaturedIconPkg as Record<string, unknown>,
  '@tale-ui/react/avatar': AvatarPkg as Record<string, unknown>,
  '@tale-ui/react/row': RowPkg as Record<string, unknown>,
  '@tale-ui/react/column': ColumnPkg as Record<string, unknown>,
  '@tale-ui/react/text': TextPkg as Record<string, unknown>,
  '@tale-ui/react/separator': SeparatorPkg as Record<string, unknown>,
  '@tale-ui/react/rating-stars': RatingStarsPkg as Record<string, unknown>,
  '@tale-ui/react/color-mode-toggle': ColorModeTogglePkg as Record<string, unknown>,
  '@tale-ui/react/pagination': PaginationPkg as Record<string, unknown>,
  '@tale-ui/react/menu': MenuPkg as Record<string, unknown>,
  '@tale-ui/react/breadcrumbs': BreadcrumbsPkg as Record<string, unknown>,
  '@tale-ui/react/tag-group': TagGroupPkg as Record<string, unknown>,
  '@tale-ui/react/table': TablePkg as Record<string, unknown>,
  '@tale-ui/react/empty-state': EmptyStatePkg as Record<string, unknown>,
  '@tale-ui/react/meter': MeterPkg as Record<string, unknown>,
  '@tale-ui/react/field': FieldPkg as Record<string, unknown>,
  '@tale-ui/react/form': FormPkg as Record<string, unknown>,
  '@tale-ui/react/alert-dialog': AlertDialogPkg as Record<string, unknown>,
  '@tale-ui/react/autocomplete': AutocompletePkg as Record<string, unknown>,
  '@tale-ui/react/background-pattern': BackgroundPatternPkg as Record<string, unknown>,
  '@tale-ui/react/badge-group': BadgeGroupPkg as Record<string, unknown>,
  '@tale-ui/react/calendar': CalendarPkg as Record<string, unknown>,
  '@tale-ui/react/carousel': CarouselPkg as Record<string, unknown>,
  '@tale-ui/react/checkbox-group': CheckboxGroupPkg as Record<string, unknown>,
  '@tale-ui/react/color-area': ColorAreaPkg as Record<string, unknown>,
  '@tale-ui/react/color-field': ColorFieldPkg as Record<string, unknown>,
  '@tale-ui/react/color-picker': ColorPickerPkg as Record<string, unknown>,
  '@tale-ui/react/color-slider': ColorSliderPkg as Record<string, unknown>,
  '@tale-ui/react/color-swatch': ColorSwatchPkg as Record<string, unknown>,
  '@tale-ui/react/color-swatch-picker': ColorSwatchPickerPkg as Record<string, unknown>,
  '@tale-ui/react/color-wheel': ColorWheelPkg as Record<string, unknown>,
  '@tale-ui/react/context-menu': ContextMenuPkg as Record<string, unknown>,
  '@tale-ui/react/credit-card': CreditCardPkg as Record<string, unknown>,
  '@tale-ui/react/date-field': DateFieldPkg as Record<string, unknown>,
  '@tale-ui/react/date-picker': DatePickerPkg as Record<string, unknown>,
  '@tale-ui/react/date-range-picker': DateRangePickerPkg as Record<string, unknown>,
  '@tale-ui/react/disclosure': DisclosurePkg as Record<string, unknown>,
  '@tale-ui/react/dot-icon': DotIconPkg as Record<string, unknown>,
  '@tale-ui/react/drop-zone': DropZonePkg as Record<string, unknown>,
  '@tale-ui/react/fieldset': FieldsetPkg as Record<string, unknown>,
  '@tale-ui/react/file-trigger': FileTriggerPkg as Record<string, unknown>,
  '@tale-ui/react/file-upload': FileUploadPkg as Record<string, unknown>,
  '@tale-ui/react/grid-list': GridListPkg as Record<string, unknown>,
  '@tale-ui/react/header-nav': HeaderNavPkg as Record<string, unknown>,
  '@tale-ui/react/illustration': IllustrationPkg as Record<string, unknown>,
  '@tale-ui/react/image': ImagePkg as Record<string, unknown>,
  '@tale-ui/react/image-cropper': ImageCropperPkg as Record<string, unknown>,
  '@tale-ui/react/input-group': InputGroupPkg as Record<string, unknown>,
  '@tale-ui/react/input-tags': InputTagsPkg as Record<string, unknown>,
  '@tale-ui/react/iphone-mockup': IPhoneMockupPkg as Record<string, unknown>,
  '@tale-ui/react/link': LinkPkg as Record<string, unknown>,
  '@tale-ui/react/list': ListPkg as Record<string, unknown>,
  '@tale-ui/react/menubar': MenubarPkg as Record<string, unknown>,
  '@tale-ui/react/multi-select': MultiSelectPkg as Record<string, unknown>,
  '@tale-ui/react/navigation-menu': NavigationMenuPkg as Record<string, unknown>,
  '@tale-ui/react/pagination-dot': PaginationDotPkg as Record<string, unknown>,
  '@tale-ui/react/pagination-line': PaginationLinePkg as Record<string, unknown>,
  '@tale-ui/react/payment-input': PaymentInputPkg as Record<string, unknown>,
  '@tale-ui/react/pin-input': PinInputPkg as Record<string, unknown>,
  '@tale-ui/react/preview-card': PreviewCardPkg as Record<string, unknown>,
  '@tale-ui/react/progress-circle': ProgressCirclePkg as Record<string, unknown>,
  '@tale-ui/react/qr-code': QRCodePkg as Record<string, unknown>,
  '@tale-ui/react/radio-group': RadioGroupPkg as Record<string, unknown>,
  '@tale-ui/react/range-calendar': RangeCalendarPkg as Record<string, unknown>,
  '@tale-ui/react/rating-badge': RatingBadgePkg as Record<string, unknown>,
  '@tale-ui/react/scroll-area': ScrollAreaPkg as Record<string, unknown>,
  '@tale-ui/react/section-divider': SectionDividerPkg as Record<string, unknown>,
  '@tale-ui/react/select-native': SelectNativePkg as Record<string, unknown>,
  '@tale-ui/react/sidebar': SidebarPkg as Record<string, unknown>,
  '@tale-ui/react/social-button': SocialButtonPkg as Record<string, unknown>,
  '@tale-ui/react/tag-select': TagSelectPkg as Record<string, unknown>,
  '@tale-ui/react/text-editor': TextEditorPkg as Record<string, unknown>,
  '@tale-ui/react/time-field': TimeFieldPkg as Record<string, unknown>,
  '@tale-ui/react/toolbar': ToolbarPkg as Record<string, unknown>,
  '@tale-ui/react/tree': TreePkg as Record<string, unknown>,
  '@tale-ui/react/video-player': VideoPlayerPkg as Record<string, unknown>,
  '@tale-ui/react/app-store-button': AppStoreButtonPkg as Record<string, unknown>,
  '@tale-ui/charts/area-chart': AreaChartPkg as Record<string, unknown>,
  '@tale-ui/charts/bar-chart': BarChartPkg as Record<string, unknown>,
  '@tale-ui/charts/line-chart': LineChartPkg as Record<string, unknown>,
  '@tale-ui/charts/pie-chart': PieChartPkg as Record<string, unknown>,
  '@tale-ui/charts/radar-chart': RadarChartPkg as Record<string, unknown>,
  '@tale-ui/charts/radial-bar-chart': RadialBarChartPkg as Record<string, unknown>,
  'lucide-react': LucideReactPkg as unknown as Record<string, unknown>,
  'react-hook-form': ReactHookFormPkg as unknown as Record<string, unknown>,
  '@tale-ui/charts': ChartsPkg as unknown as Record<string, unknown>,
};

const proxyCache = new WeakMap<object, Record<string, unknown>>();

function createMissingComponent(name: string) {
  function MissingComponent() {
    throw new Error(
      `Unknown component export: ${name}. Check the generated code for an invented import or subcomponent.`,
    );
  }
  MissingComponent.displayName = `Missing(${name})`;
  return MissingComponent;
}

function proxifyExports(pkg: Record<string, unknown>, label: string): Record<string, unknown> {
  const cached = proxyCache.get(pkg);
  if (cached) {
    return cached;
  }

  const proxy = new Proxy(pkg, {
    get(target, prop, receiver) {
      if (typeof prop !== 'string') {
        return Reflect.get(target, prop, receiver);
      }
      if (prop in target) {
        const value = Reflect.get(target, prop, receiver);
        if (value && typeof value === 'object') {
          return proxifyExports(value as Record<string, unknown>, `${label}.${prop}`);
        }
        return value;
      }
      return createMissingComponent(`${label}.${prop}`);
    },
  });

  proxyCache.set(pkg, proxy);
  return proxy;
}

const PROXIED_MODULE_MAP: Record<string, Record<string, unknown>> = Object.fromEntries(
  Object.entries(MODULE_MAP).map(([path, pkg]) => [path, proxifyExports(pkg, path)]),
);

// Flatten Tale UI packages + lucide-react into a single scope bag (used for the const destructuring in new Function).
// Exclude 'react' — it's in MODULE_MAP for requireShim but its namespace keys (including 'default')
// are reserved words that would break the destructure statement.
const SCOPE: Record<string, unknown> = Object.entries(MODULE_MAP)
  .filter(([key]) => key !== 'react')
  .reduce(
    (acc, [key]) => Object.assign(acc, PROXIED_MODULE_MAP[key]),
    {} as Record<string, unknown>,
  );

// Convert kebab-case module segment to PascalCase component name.
// e.g. 'text-field' → 'TextField', 'toggle-button' → 'ToggleButton'
function kebabToPascal(s: string): string {
  return s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/^[a-z]/, c => c.toUpperCase());
}

// require() shim for Sucrase's CommonJS output.
// Returns the package's own named exports. For compound components (TextField, Select, etc.)
// that don't export themselves by name, also exposes the whole package as the namespace
// (e.g. TextField: TextFieldPkg) so _textField.TextField.Root works.
function requireShim(path: string): Record<string, unknown> {
  const pkg = PROXIED_MODULE_MAP[path] ?? SCOPE;
  const segment = (path.split('/').pop() ?? '');
  const componentName = kebabToPascal(segment);
  // Only add the namespace alias when the package doesn't already export under that name
  // (avoids replacing Button.Button component with the whole ButtonPkg object)
  if (!(componentName in pkg)) {
    return { ...pkg, [componentName]: pkg };
  }
  return pkg;
}

const rootEl = document.getElementById('root')!;
const errorDiv = document.getElementById('preview-error')!;

function showError(msg: string) {
  errorDiv.style.display = 'block';
  errorDiv.textContent = msg;
}

function clearError() {
  errorDiv.style.display = 'none';
  errorDiv.textContent = '';
}

// Error boundary so React rendering errors appear in the error div instead of silently blanking the preview.
class PreviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { caught: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { caught: false };
  }
  static getDerivedStateFromError() { return { caught: true }; }
  componentDidCatch(error: Error) {
    showError(`${error.name}: ${error.message}\n\n${error.stack ?? ''}`);
  }
  render() {
    if (this.state.caught) {return null;}
    return this.props.children;
  }
}

let renderKey = 0;
const root = ReactDOM.createRoot(rootEl);

function renderCode(compiledJs: string) {
  clearError();
  try {
    // Sucrase 'imports' transform converts ES module syntax to CommonJS.
    // We provide require (returns from SCOPE so _pkg.Button = SCOPE.Button)
    // and an exports object to collect the exported Example component.
    const modExports: Record<string, unknown> = {};

     
    const factory = new Function('React', 'components', 'require', 'exports', `
      const {${Object.keys(SCOPE).join(',')}} = components;
      ${compiledJs}
    `);
    factory(React, SCOPE, requireShim, modExports);

    const ExampleComponent = (modExports.Example ?? modExports.default) as React.FC | null;
    if (!ExampleComponent) {
      showError('No `Example` function exported. Make sure your code has:\nexport function Example() { ... }');
      return;
    }
    // Increment key to reset the error boundary state on each new render.
    renderKey += 1;
    root.render(
      <PreviewErrorBoundary key={renderKey}>
        <React.Suspense fallback={<span>Loading…</span>}>
          <ExampleComponent />
        </React.Suspense>
      </PreviewErrorBoundary>,
    );
  } catch (err) {
    showError(err instanceof Error ? `${err.name}: ${err.message}\n\n${err.stack ?? ''}` : String(err));
  }
}

window.addEventListener('message', entry => {
  if (!entry.data) {return;}
  if (entry.data.type === 'render') {
    renderCode(entry.data.code as string);
  }
});

// Signal to parent that the iframe is ready
window.parent.postMessage({ type: 'ready' }, '*');
