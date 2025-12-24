/**
 * Icon System - Curated Lucide icon subset with consistent sizes
 * Re-exports commonly used icons with fixed sizing props
 */

import {
  // Navigation & UI
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  
  // Actions
  Check,
  CheckCircle,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  
  // Status & Feedback
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  Zap,
  Star,
  Award,
  Shield,
  Lock,
  Unlock,
  
  // Content
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  Building,
  FileText,
  Image as ImageIcon,
  Video,
  
  // Business
  TrendingUp,
  TrendingDown,
  Target,
  BarChart,
  PieChart,
  Activity,
  
  // Communication
  MessageCircle,
  MessageSquare,
  Send,
  Inbox,
  
  // Media
  Play,
  PlayCircle,
  Pause,
  Stop,
  Volume2,
  VolumeX,
  
  // Tech
  Chrome,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  
  // Misc
  Heart,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  
  // Arrows & Direction
  RefreshCw,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  
  // Coding
  Code,
  Terminal,
  Package,
  
  // Social
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  
  // Shapes
  Square,
  Circle,
  Triangle,
  Frown,
  Smile,
  Meh,
  
  // Special
  Quote,
  MousePointerClick,
  
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

/**
 * Icon size presets
 */
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

/**
 * Default icon props
 */
export const DEFAULT_ICON_PROPS: Partial<LucideProps> = {
  size: ICON_SIZES.md,
  strokeWidth: 2,
};

/**
 * Icon size utility
 */
export function getIconSize(size: keyof typeof ICON_SIZES = 'md') {
  return ICON_SIZES[size];
}

/**
 * Commonly used icon sets organized by category
 */
export const Icons = {
  // Navigation
  navigation: {
    Bell,
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    ArrowLeft,
    ExternalLink,
  },
  
  // Actions
  actions: {
    Check,
    CheckCircle,
    Plus,
    Minus,
    Search,
    Filter,
    Settings,
    Download,
    Upload,
    Share2,
    Copy,
    Edit,
    Trash2,
  },
  
  // Status
  status: {
    AlertCircle,
    AlertTriangle,
    Info,
    HelpCircle,
    Sparkles,
    Zap,
    Star,
    Award,
    Shield,
    Lock,
    Unlock,
  },
  
  // Content
  content: {
    Calendar,
    Clock,
    MapPin,
    Mail,
    Phone,
    User,
    Users,
    Building,
    FileText,
    ImageIcon,
    Video,
  },
  
  // Business
  business: {
    TrendingUp,
    TrendingDown,
    Target,
    BarChart,
    PieChart,
    Activity,
  },
  
  // Communication
  communication: {
    MessageCircle,
    MessageSquare,
    Send,
    Inbox,
  },
  
  // Media
  media: {
    Play,
    PlayCircle,
    Pause,
    Stop,
    Volume2,
    VolumeX,
  },
  
  // Tech
  tech: {
    Chrome,
    Smartphone,
    Monitor,
    Tablet,
    Wifi,
    WifiOff,
    Bluetooth,
    Battery,
  },
  
  // Misc
  misc: {
    Heart,
    Eye,
    EyeOff,
    ThumbsUp,
    ThumbsDown,
    Bookmark,
    Flag,
    Quote,
    MousePointerClick,
  },
  
  // Arrows
  arrows: {
    RefreshCw,
    RotateCw,
    RotateCcw,
    Maximize,
    Minimize,
  },
  
  // Social
  social: {
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Github,
    Youtube,
  },
  
  // Shapes
  shapes: {
    Square,
    Circle,
    Triangle,
  },
  
  // Emotions
  emotions: {
    Frown,
    Smile,
    Meh,
  },
} as const;

/**
 * Re-export all icons for direct import
 */
export {
  // Navigation & UI
  Bell,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  
  // Actions
  Check,
  CheckCircle,
  Plus,
  Minus,
  Search,
  Filter,
  Settings,
  Download,
  Upload,
  Share2,
  Copy,
  Edit,
  Trash2,
  
  // Status & Feedback
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Sparkles,
  Zap,
  Star,
  Award,
  Shield,
  Lock,
  Unlock,
  
  // Content
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  User,
  Users,
  Building,
  FileText,
  ImageIcon,
  Video,
  
  // Business
  TrendingUp,
  TrendingDown,
  Target,
  BarChart,
  PieChart,
  Activity,
  
  // Communication
  MessageCircle,
  MessageSquare,
  Send,
  Inbox,
  
  // Media
  Play,
  PlayCircle,
  Pause,
  Stop,
  Volume2,
  VolumeX,
  
  // Tech
  Chrome,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Bluetooth,
  Battery,
  
  // Misc
  Heart,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Flag,
  
  // Arrows & Direction
  RefreshCw,
  RotateCw,
  RotateCcw,
  Maximize,
  Minimize,
  
  // Coding
  Code,
  Terminal,
  Package,
  
  // Social
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  
  // Shapes
  Square,
  Circle,
  Triangle,
  Frown,
  Smile,
  Meh,
  
  // Special
  Quote,
  MousePointerClick,
  
  // Types
  type LucideIcon,
  type LucideProps,
};

export default Icons;
