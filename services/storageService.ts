
import { 
  INITIAL_BRANCHES, 
  INITIAL_LINKS, 
  INITIAL_NEWS, 
  INITIAL_PROJECTS, 
  INITIAL_SERVICES, 
  INITIAL_PARTNERS, 
  INITIAL_HONORS, 
  DEFAULT_SITE_SETTINGS,
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_MEDIA,
  INITIAL_PAGE_CONTENT,
  INITIAL_TEAM,
  COMPANY_HISTORY
} from '../constants';
import { 
  Branch, 
  NavigationLink, 
  NewsItem, 
  ProjectCase, 
  Service, 
  User, 
  Partner, 
  Honor, 
  SiteSettings,
  Role,
  MediaItem,
  PageContent,
  TeamMember,
  HistoryEvent
} from '../types';

const KEYS = {
  NEWS: 'yanyun_news',
  PROJECTS: 'yanyun_projects',
  SERVICES: 'yanyun_services',
  BRANCHES: 'yanyun_branches',
  LINKS: 'yanyun_links',
  CURRENT_USER: 'yanyun_current_user',
  USERS: 'yanyun_users',
  ROLES: 'yanyun_roles',
  PARTNERS: 'yanyun_partners',
  HONORS: 'yanyun_honors',
  SETTINGS: 'yanyun_settings',
  MEDIA: 'yanyun_media',
  PAGE_CONTENT: 'yanyun_page_content',
  TEAM: 'yanyun_team',
  HISTORY: 'yanyun_history'
};

// Initialize storage if empty
const initStorage = () => {
  if (!localStorage.getItem(KEYS.NEWS)) localStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
  if (!localStorage.getItem(KEYS.PROJECTS)) localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  if (!localStorage.getItem(KEYS.SERVICES)) localStorage.setItem(KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
  if (!localStorage.getItem(KEYS.BRANCHES)) localStorage.setItem(KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));
  if (!localStorage.getItem(KEYS.LINKS)) localStorage.setItem(KEYS.LINKS, JSON.stringify(INITIAL_LINKS));
  if (!localStorage.getItem(KEYS.PARTNERS)) localStorage.setItem(KEYS.PARTNERS, JSON.stringify(INITIAL_PARTNERS));
  if (!localStorage.getItem(KEYS.HONORS)) localStorage.setItem(KEYS.HONORS, JSON.stringify(INITIAL_HONORS));
  if (!localStorage.getItem(KEYS.SETTINGS)) localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SITE_SETTINGS));
  if (!localStorage.getItem(KEYS.ROLES)) localStorage.setItem(KEYS.ROLES, JSON.stringify(INITIAL_ROLES));
  if (!localStorage.getItem(KEYS.USERS)) localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  if (!localStorage.getItem(KEYS.MEDIA)) localStorage.setItem(KEYS.MEDIA, JSON.stringify(INITIAL_MEDIA));
  if (!localStorage.getItem(KEYS.PAGE_CONTENT)) localStorage.setItem(KEYS.PAGE_CONTENT, JSON.stringify(INITIAL_PAGE_CONTENT));
  if (!localStorage.getItem(KEYS.TEAM)) localStorage.setItem(KEYS.TEAM, JSON.stringify(INITIAL_TEAM));
  if (!localStorage.getItem(KEYS.HISTORY)) localStorage.setItem(KEYS.HISTORY, JSON.stringify(COMPANY_HISTORY));
};

initStorage();

export const storageService = {
  // Generic Get
  getItems: <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  // Generic Save
  saveItems: <T>(key: string, items: T[]) => {
    localStorage.setItem(key, JSON.stringify(items));
  },

  // Specific Helpers
  getNews: () => storageService.getItems<NewsItem>(KEYS.NEWS),
  
  getNewsById: (id: string): NewsItem | undefined => {
    const news = storageService.getNews();
    return news.find(n => n.id === id);
  },

  getRelatedNews: (currentId: string, limit: number = 3): NewsItem[] => {
    const news = storageService.getNews();
    return news
      .filter(n => n.id !== currentId && n.published)
      .slice(0, limit);
  },

  saveNews: (items: NewsItem[]) => storageService.saveItems(KEYS.NEWS, items),

  getProjects: () => storageService.getItems<ProjectCase>(KEYS.PROJECTS),
  saveProjects: (items: ProjectCase[]) => storageService.saveItems(KEYS.PROJECTS, items),

  getServices: () => storageService.getItems<Service>(KEYS.SERVICES),
  saveServices: (items: Service[]) => storageService.saveItems(KEYS.SERVICES, items),

  getBranches: () => storageService.getItems<Branch>(KEYS.BRANCHES),
  saveBranches: (items: Branch[]) => storageService.saveItems(KEYS.BRANCHES, items),
  
  getLinks: () => storageService.getItems<NavigationLink>(KEYS.LINKS),
  saveLinks: (items: NavigationLink[]) => storageService.saveItems(KEYS.LINKS, items),

  getPartners: () => storageService.getItems<Partner>(KEYS.PARTNERS),
  savePartners: (items: Partner[]) => storageService.saveItems(KEYS.PARTNERS, items),

  getHonors: () => storageService.getItems<Honor>(KEYS.HONORS),
  saveHonors: (items: Honor[]) => storageService.saveItems(KEYS.HONORS, items),

  // Page Content
  getPageContent: (): PageContent => {
    const data = localStorage.getItem(KEYS.PAGE_CONTENT);
    return data ? JSON.parse(data) : INITIAL_PAGE_CONTENT;
  },
  savePageContent: (content: PageContent) => {
    localStorage.setItem(KEYS.PAGE_CONTENT, JSON.stringify(content));
  },

  // Team
  getTeam: () => storageService.getItems<TeamMember>(KEYS.TEAM),
  saveTeam: (items: TeamMember[]) => storageService.saveItems(KEYS.TEAM, items),

  // History
  getHistory: () => storageService.getItems<HistoryEvent>(KEYS.HISTORY),
  saveHistory: (items: HistoryEvent[]) => storageService.saveItems(KEYS.HISTORY, items),

  getSettings: (): SiteSettings => {
    const data = localStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SITE_SETTINGS;
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  getMedia: () => storageService.getItems<MediaItem>(KEYS.MEDIA),
  saveMedia: (items: MediaItem[]) => storageService.saveItems(KEYS.MEDIA, items),
  
  // Auth & RBAC
  getUsers: () => storageService.getItems<User>(KEYS.USERS),
  saveUsers: (users: User[]) => storageService.saveItems(KEYS.USERS, users),
  
  getRoles: () => storageService.getItems<Role>(KEYS.ROLES),
  saveRoles: (roles: Role[]) => storageService.saveItems(KEYS.ROLES, roles),
  
  getRoleById: (id: string): Role | undefined => {
    const roles = storageService.getRoles();
    return roles.find(r => r.id === id);
  },

  login: (username: string): boolean => {
     const users = storageService.getUsers();
     const user = users.find(u => u.username === username);
     if (user) {
        localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        return true;
     }
     return false;
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  getCurrentUserRole: (): Role | null => {
    const user = storageService.getCurrentUser();
    if (!user) return null;
    return storageService.getRoleById(user.roleId) || null;
  }
};
