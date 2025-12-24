
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
  | 'pages';

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
}

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

export interface ProjectCase {
  id: string;
  title: string;
  category: string;
  description: string;
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

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  coordinates: { lat: number; lng: number };
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

export interface Honor {
  id: string;
  title: string;
  issueDate: string;
  issuingAuthority: string;
  imageUrl: string;
}

// Added missing Testimonial interface to match constants.ts exports
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
  themeColor: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  copyrightText: string;
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

export interface PageContent {
  headers: {
    about: PageHeaderConfig;
    services: PageHeaderConfig;
    cases: PageHeaderConfig;
    news: PageHeaderConfig;
    branches: PageHeaderConfig;
    contact: PageHeaderConfig;
    navigation: PageHeaderConfig;
  };
  home: {
    hero: {
      badge: string;
      titleLine1: string;
      titleHighlight: string;
      description: string;
      bgImage: string;
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
