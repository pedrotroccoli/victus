import {
  // Fitness
  Dumbbell,
  Heart,
  Activity,
  Footprints,
  Bike,
  Timer,
  Trophy,
  Medal,
  Zap,
  Flame,

  // Food & Drink
  Apple,
  Coffee,
  Utensils,
  GlassWater,
  Salad,
  Cookie,
  Pizza,
  Croissant,
  Wine,
  Soup,

  // Wellness
  Moon,
  Sun,
  Smile,
  Brain,
  Bed,
  Bath,
  Leaf,
  Sparkles,
  CloudSun,
  TreePine,

  // Productivity
  Briefcase,
  Laptop,
  Book,
  Pencil,
  Target,
  CheckSquare,
  Clock,
  Calendar,
  FileText,
  Lightbulb,

  // Social
  Users,
  MessageCircle,
  Phone,
  HeartHandshake,
  Gift,
  PartyPopper,
  Baby,
  Dog,
  Cat,
  Home,

  // Finance
  Wallet,
  PiggyBank,
  TrendingUp,
  Coins,
  CreditCard,
  Receipt,
  DollarSign,
  Banknote,

  // Hobbies
  Music,
  Camera,
  Gamepad2,
  Palette,
  BookOpen,
  Headphones,
  Guitar,
  Clapperboard,
  Brush,
  Scissors,

  // General
  Star,
  Flag,
  Circle,
  Square,
  Tag,
  Folder,
  Bookmark,
  Bell,
  Settings,
  Globe,

  type LucideIcon,
} from 'lucide-react';

export const categoryIcons = {
  // Fitness
  dumbbell: Dumbbell,
  heart: Heart,
  activity: Activity,
  footprints: Footprints,
  bike: Bike,
  timer: Timer,
  trophy: Trophy,
  medal: Medal,
  zap: Zap,
  flame: Flame,

  // Food & Drink
  apple: Apple,
  coffee: Coffee,
  utensils: Utensils,
  'glass-water': GlassWater,
  salad: Salad,
  cookie: Cookie,
  pizza: Pizza,
  croissant: Croissant,
  wine: Wine,
  soup: Soup,

  // Wellness
  moon: Moon,
  sun: Sun,
  smile: Smile,
  brain: Brain,
  bed: Bed,
  bath: Bath,
  leaf: Leaf,
  sparkles: Sparkles,
  'cloud-sun': CloudSun,
  'tree-pine': TreePine,

  // Productivity
  briefcase: Briefcase,
  laptop: Laptop,
  book: Book,
  pencil: Pencil,
  target: Target,
  'check-square': CheckSquare,
  clock: Clock,
  calendar: Calendar,
  'file-text': FileText,
  lightbulb: Lightbulb,

  // Social
  users: Users,
  'message-circle': MessageCircle,
  phone: Phone,
  'heart-handshake': HeartHandshake,
  gift: Gift,
  'party-popper': PartyPopper,
  baby: Baby,
  dog: Dog,
  cat: Cat,
  home: Home,

  // Finance
  wallet: Wallet,
  'piggy-bank': PiggyBank,
  'trending-up': TrendingUp,
  coins: Coins,
  'credit-card': CreditCard,
  receipt: Receipt,
  'dollar-sign': DollarSign,
  banknote: Banknote,

  // Hobbies
  music: Music,
  camera: Camera,
  'gamepad-2': Gamepad2,
  palette: Palette,
  'book-open': BookOpen,
  headphones: Headphones,
  guitar: Guitar,
  clapperboard: Clapperboard,
  brush: Brush,
  scissors: Scissors,

  // General
  star: Star,
  flag: Flag,
  circle: Circle,
  square: Square,
  tag: Tag,
  folder: Folder,
  bookmark: Bookmark,
  bell: Bell,
  settings: Settings,
  globe: Globe,
} as const;

export type CategoryIconName = keyof typeof categoryIcons;

export const iconCategories: Record<string, CategoryIconName[]> = {
  fitness: ['dumbbell', 'heart', 'activity', 'footprints', 'bike', 'timer', 'trophy', 'medal', 'zap', 'flame'],
  'food-drink': ['apple', 'coffee', 'utensils', 'glass-water', 'salad', 'cookie', 'pizza', 'croissant', 'wine', 'soup'],
  wellness: ['moon', 'sun', 'smile', 'brain', 'bed', 'bath', 'leaf', 'sparkles', 'cloud-sun', 'tree-pine'],
  productivity: ['briefcase', 'laptop', 'book', 'pencil', 'target', 'check-square', 'clock', 'calendar', 'file-text', 'lightbulb'],
  social: ['users', 'message-circle', 'phone', 'heart-handshake', 'gift', 'party-popper', 'baby', 'dog', 'cat', 'home'],
  finance: ['wallet', 'piggy-bank', 'trending-up', 'coins', 'credit-card', 'receipt', 'dollar-sign', 'banknote'],
  hobbies: ['music', 'camera', 'gamepad-2', 'palette', 'book-open', 'headphones', 'guitar', 'clapperboard', 'brush', 'scissors'],
  general: ['star', 'flag', 'circle', 'square', 'tag', 'folder', 'bookmark', 'bell', 'settings', 'globe'],
};

export const iconCategoryLabels: Record<string, string> = {
  fitness: 'Fitness',
  'food-drink': 'Food & Drink',
  wellness: 'Wellness',
  productivity: 'Productivity',
  social: 'Social',
  finance: 'Finance',
  hobbies: 'Hobbies',
  general: 'General',
};

export function getCategoryIcon(name: string | undefined): LucideIcon | undefined {
  if (!name) return undefined;
  return categoryIcons[name as CategoryIconName];
}

export { type LucideIcon };
