/**
 * Icon Registry
 *
 * Maps A2UI icon name strings to lucide-react icon components.
 * Agents reference icons by name (e.g. "search", "user", "settings");
 * this registry resolves them to actual React components.
 */

import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  AlertTriangle,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Bookmark,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  Filter,
  Folder,
  Globe,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Link,
  List,
  Loader,
  Lock,
  LogOut,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Minus,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Palette,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Share,
  ShoppingCart,
  Slash,
  Star,
  Sun,
  Trash,
  Upload,
  User,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react';

/**
 * Map of lowercase icon names to lucide-react components.
 * Agents use these names in A2UI messages; the renderer resolves them here.
 */
const iconMap: Record<string, LucideIcon> = {
  'alert-circle': AlertCircle,
  'alert-triangle': AlertTriangle,
  archive: Archive,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-up': ArrowUp,
  bell: Bell,
  bookmark: Bookmark,
  calendar: Calendar,
  check: Check,
  'check-circle': CheckCircle,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  clock: Clock,
  copy: Copy,
  download: Download,
  edit: Edit,
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  file: File,
  filter: Filter,
  folder: Folder,
  globe: Globe,
  heart: Heart,
  'help-circle': HelpCircle,
  home: Home,
  image: Image,
  info: Info,
  link: Link,
  list: List,
  loader: Loader,
  lock: Lock,
  'log-out': LogOut,
  mail: Mail,
  map: Map,
  menu: Menu,
  'message-circle': MessageCircle,
  minus: Minus,
  moon: Moon,
  'more-horizontal': MoreHorizontal,
  'more-vertical': MoreVertical,
  palette: Palette,
  pencil: Pencil,
  phone: Phone,
  plus: Plus,
  'refresh-cw': RefreshCw,
  search: Search,
  send: Send,
  settings: Settings,
  share: Share,
  'shopping-cart': ShoppingCart,
  slash: Slash,
  star: Star,
  sun: Sun,
  trash: Trash,
  upload: Upload,
  user: User,
  users: Users,
  x: X,
  'x-circle': XCircle,
  zap: Zap,
};

/** Custom icons registered at runtime. */
const customIcons: Record<string, LucideIcon> = {};

/**
 * Resolve an icon name to a lucide-react component.
 * Returns `HelpCircle` as fallback for unknown names.
 */
export function resolveIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  return customIcons[key] ?? iconMap[key] ?? HelpCircle;
}

/**
 * Register additional icons at runtime.
 * Useful for extending the default set with app-specific icons.
 */
export function registerIcons(icons: Record<string, LucideIcon>): void {
  for (const [name, component] of Object.entries(icons)) {
    customIcons[name.toLowerCase()] = component;
  }
}

/** Get all available icon names (built-in + custom). */
export function getIconNames(): string[] {
  return [...new Set([...Object.keys(iconMap), ...Object.keys(customIcons)])].sort();
}
