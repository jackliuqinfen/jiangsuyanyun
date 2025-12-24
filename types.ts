
export enum UserRole {
  ADMIN = 'ADMIN',
}

export type ResourceType = 
  | 'news' 
  | 'projects' 
  | 'services' 
  | 'branches' 
  | 'partners' 
  | 'honors' 
  | 'media' 
  | 'users' 
  | 'settings'
  | 'navigation'
  | 'team'
  | 'history'
  | 'tenders' // Added tenders resource
  | 'pages'
  | 'security'; // Added security resource

export interface Permission {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  permissions: Record<ResourceType, Permission>;
}

export interface User {
  id: string;
  username: string;
  name: string;
  roleId: string;
  avatar?: string;
  lastLogin?: string;
  // Security fields
  mfaEnabled?: boolean;
  phone?: string;
  email?: string;
}

// ... [Keep existing NewsItem, TenderItem, etc. unchanged] ...
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  category: string;
  imageUrl?: string;
  published: boolean;
}

export type TenderCategory = '招标公告' | '中标公告' | '其他公告';
export type TenderStatus = '报名中' | '进行中' | '已截止' | '公示中' | '已结束';

export interface TenderItem {
  id: string;
  title: string;
  projectNo: string;
  category: TenderCategory;
  region: string;
  date: string;
  deadline?: string;
  status: TenderStatus;
  content?: string;
}

export interface ProjectCase {
  id: string;
  title: string;
  category: string;
  description: string;
  content?: string; // Added rich text content
  imageUrl: string;
  location: string;
  date: string;
  isFeatured: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  order: number;
}

export interface BranchCategory {
  id: string;
  name: string;
  order: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  coordinates: { lat: number; lng: number };
  categoryId: string;
}

export interface NavigationLink {
  id: string;
  title: string;
  url: string;
  category: string;
  description?: string;
}

export interface HistoryEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  website?: string;
}

export interface HonorCategory {
  id: string;
  name: string;
  order: number;
}

export interface Honor {
  id: string;
  title: string;
  issueDate: string;
  issuingAuthority: string;
  imageUrl: string;
  categoryId: string;
  content?: string; // Added rich text content
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  avatarUrl: string;
}

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  graphicLogoUrl: string;
  textLogoUrl: string;
  faviconUrl: string; 
  themeColor: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  copyrightText: string;
  // Anniversary Popup Settings
  enableAnniversary?: boolean; 
  anniversaryTitle?: string;
  anniversarySubtitle?: string;
  anniversaryBadgeLabel?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  uploadDate: string;
  size?: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  count: number;
}

export type SectionType = 'hero' | 'stats' | 'services' | 'projects' | 'honors' | 'process' | 'partners' | 'cta';

export interface HomeSectionConfig {
  id: string;
  type: SectionType;
  label: string;
  isVisible: boolean;
  order: number;
}

export interface FooterLink {
  id: string;
  name: string;
  path: string;
  isVisible: boolean;
}

export interface PageContent {
  headers: {
    about: PageHeaderConfig;
    services: PageHeaderConfig;
    cases: PageHeaderConfig;
    news: PageHeaderConfig;
    branches: PageHeaderConfig;
    contact: PageHeaderConfig;
    navigation: PageHeaderConfig;
    honors: PageHeaderConfig;
    tenders: PageHeaderConfig;
  };
  footer: {
    quickLinks: FooterLink[];
    showContactInfo: boolean;
    showCopyright: boolean;
  };
  home: {
    layout: HomeSectionConfig[];
    hero: {
      badge: string;
      titleLine1: string;
      titleHighlight: string;
      description: string;
      bgImage: string;
      buttonText: string;
      buttonLink: string;
      secondaryButtonText: string;
      secondaryButtonLink: string;
    };
    stats: {
      stat1: { value: string; label: string };
      stat2: { value: string; label: string };
      stat3: { value: string; label: string };
      stat4: { value: string; label: string };
    };
    process: {
      title: string;
      description: string;
      steps: { title: string; desc: string }[];
    };
    cta: {
      title: string;
      description: string;
      buttonText: string;
      buttonLink: string;
    };
  };
  about: {
    intro: {
      title: string;
      content1: string;
      content2: string;
      imageUrl: string;
    };
    culture: {
      mission: string;
      values: string;
      management: string;
    };
  };
  services: {
    introStats: { icon: string; label: string; desc: string }[];
    faqs: { q: string; a: string }[];
  };
}

export interface PageHeaderConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

// --- NEW SECURITY TYPES ---

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;      // e.g., 'LOGIN', 'CREATE', 'DELETE'
  resource: string;    // e.g., 'News', 'User'
  details: string;
  timestamp: string;
  ipAddress: string;   // Simulated
  status: 'SUCCESS' | 'FAILURE';
}

export interface LoginAttempt {
  count: number;
  lastAttempt: number; // timestamp
  isLocked: boolean;
  lockUntil: number;   // timestamp
}

export interface SecurityConfig {
  mfaEnabled: boolean;
  passwordMinLength: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  sessionTimeoutMinutes: number;
}