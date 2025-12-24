
export enum UserRole {
  ADMIN = 'ADMIN', // Legacy support
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
  | 'pages'; // For generic page content

export interface Permission {
  read: boolean;
  write: boolean; // Create and Update
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean; // If true, cannot be deleted (e.g., Super Admin)
  permissions: Record<ResourceType, Permission>;
}

export interface User {
  id: string;
  username: string;
  name: string;
  roleId: string; // Links to Role
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
  id: string; // Added ID for CRUD
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

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  themeColor: string; // Hex code
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  copyrightText: string;
}

export interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  avatarUrl: string;
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

export interface FAQItem {
  q: string;
  a: string;
}

// Global Content Structure
export interface PageHeaderConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface PageContent {
  // Headers for all subpages
  headers: {
    about: PageHeaderConfig;
    services: PageHeaderConfig;
    cases: PageHeaderConfig;
    news: PageHeaderConfig;
    branches: PageHeaderConfig;
    contact: PageHeaderConfig;
    navigation: PageHeaderConfig;
  };
  // Home Page Specifics
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
      steps: { title: string; desc: string }[]; // Array of 4
    };
    cta: {
      title: string;
      description: string;
    };
  };
  // About Page Specifics
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
  // Services Page Specifics
  services: {
    introStats: { icon: string; label: string; desc: string }[]; // Array of 4
    faqs: FAQItem[];
  };
}
