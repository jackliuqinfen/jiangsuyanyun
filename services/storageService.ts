
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
  MediaCategory,
  PageContent,
  TeamMember,
  HistoryEvent
} from '../types';

const KEYS = {
  NEWS: 'yanyun_news_v2',
  PROJECTS: 'yanyun_projects_v2',
  SERVICES: 'yanyun_services_v2',
  BRANCHES: 'yanyun_branches_v2',
  LINKS: 'yanyun_links_v2',
  PARTNERS: 'yanyun_partners_v2',
  HONORS: 'yanyun_honors_v2',
  AUTH_TOKEN: 'yanyun_auth_token',
  CURRENT_USER: 'yanyun_current_user_v2',
  USERS: 'yanyun_users_v2',
  ROLES: 'yanyun_roles_v2',
  SETTINGS: 'yanyun_settings_v2',
  MEDIA: 'yanyun_media_v2',
  PAGE_CONTENT: 'yanyun_page_content_v2',
  TEAM: 'yanyun_team_v2',
  HISTORY: 'yanyun_history_v2'
};

const initStorage = () => {
  const safeInit = <T>(key: string, initialData: T) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  };

  safeInit(KEYS.NEWS, INITIAL_NEWS);
  safeInit(KEYS.PROJECTS, INITIAL_PROJECTS);
  safeInit(KEYS.SERVICES, INITIAL_SERVICES);
  safeInit(KEYS.BRANCHES, INITIAL_BRANCHES);
  safeInit(KEYS.LINKS, INITIAL_LINKS);
  safeInit(KEYS.PARTNERS, INITIAL_PARTNERS);
  safeInit(KEYS.HONORS, INITIAL_HONORS);
  safeInit(KEYS.SETTINGS, DEFAULT_SITE_SETTINGS);
  safeInit(KEYS.ROLES, INITIAL_ROLES);
  safeInit(KEYS.USERS, INITIAL_USERS);
  safeInit(KEYS.MEDIA, INITIAL_MEDIA);
  safeInit(KEYS.PAGE_CONTENT, INITIAL_PAGE_CONTENT);
  safeInit(KEYS.TEAM, INITIAL_TEAM);
  safeInit(KEYS.HISTORY, COMPANY_HISTORY);
};

initStorage();

// 模拟后端网络请求
const delay = (ms: number = 300) => new Promise(res => setTimeout(res, ms));

export const storageService = {
  // 通用 CRUD 抽象
  async get<T>(key: string): Promise<T[]> {
    await delay();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  async save<T>(key: string, items: T[]): Promise<void> {
    await delay();
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      throw new Error("存储限额已满，请清理后再试");
    }
  },

  // 认证与权限 (后端级模拟)
  login: async (username: string): Promise<{success: boolean, token?: string}> => {
    await delay(800);
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.username === username);
    if (user) {
      const mockToken = `ey-session-${Date.now()}`;
      sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      return { success: true, token: mockToken };
    }
    return { success: false };
  },

  logout: () => {
    sessionStorage.removeItem(KEYS.AUTH_TOKEN);
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  isAuthenticated: () => !!sessionStorage.getItem(KEYS.AUTH_TOKEN),

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  getCurrentUserRole: (): Role | null => {
    const user = storageService.getCurrentUser();
    if (!user) return null;
    const roles = JSON.parse(localStorage.getItem(KEYS.ROLES) || '[]');
    return roles.find((r: Role) => r.id === user.roleId) || null;
  },

  // 业务模型访问层
  getNews: () => storageService.get<NewsItem>(KEYS.NEWS),
  saveNews: (items: NewsItem[]) => storageService.save(KEYS.NEWS, items),
  getNewsById: async (id: string) => (await storageService.getNews()).find(n => n.id === id),
  getRelatedNews: async (id: string) => {
    const news = await storageService.getNews();
    const current = news.find(n => n.id === id);
    if (!current) return [];
    return news.filter(n => n.id !== id && n.category === current.category).slice(0, 3);
  },
  
  getProjects: () => storageService.get<ProjectCase>(KEYS.PROJECTS),
  saveProjects: (items: ProjectCase[]) => storageService.save(KEYS.PROJECTS, items),

  getServices: () => storageService.get<Service>(KEYS.SERVICES),
  saveServices: (items: Service[]) => storageService.save(KEYS.SERVICES, items),
  
  getSettings: (): SiteSettings => {
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? JSON.parse(s) : DEFAULT_SITE_SETTINGS;
  },
  saveSettings: (s: SiteSettings) => localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s)),

  getPageContent: (): PageContent => {
    const c = localStorage.getItem(KEYS.PAGE_CONTENT);
    return c ? JSON.parse(c) : INITIAL_PAGE_CONTENT;
  },
  savePageContent: (c: PageContent) => localStorage.setItem(KEYS.PAGE_CONTENT, JSON.stringify(c)),

  getPartners: () => storageService.get<Partner>(KEYS.PARTNERS),
  savePartners: (items: Partner[]) => storageService.save(KEYS.PARTNERS, items),
  
  getHistory: () => storageService.get<HistoryEvent>(KEYS.HISTORY),
  saveHistory: (items: HistoryEvent[]) => storageService.save(KEYS.HISTORY, items),
  
  getTeam: () => storageService.getTeamMembers(),
  getTeamMembers: () => storageService.get<TeamMember>(KEYS.TEAM),
  saveTeam: (items: TeamMember[]) => storageService.save(KEYS.TEAM, items),
  
  getHonors: () => storageService.get<Honor>(KEYS.HONORS),
  saveHonors: (items: Honor[]) => storageService.save(KEYS.HONORS, items),
  
  getLinks: () => storageService.get<NavigationLink>(KEYS.LINKS),
  saveLinks: (items: NavigationLink[]) => storageService.save(KEYS.LINKS, items),
  
  getMedia: () => storageService.get<MediaItem>(KEYS.MEDIA),
  saveMedia: (items: MediaItem[]) => storageService.save(KEYS.MEDIA, items),
  getMediaCategories: (): MediaCategory[] => {
    return [
      { id: 'all', name: '全部素材', count: 0 },
      { id: 'site', name: '站点资源', count: 0 },
      { id: 'news', name: '新闻配图', count: 0 },
      { id: 'project', name: '项目案例', count: 0 },
    ];
  },

  getBranches: () => storageService.get<Branch>(KEYS.BRANCHES),
  saveBranches: (items: Branch[]) => storageService.save(KEYS.BRANCHES, items),

  getUsers: () => storageService.get<User>(KEYS.USERS),
  saveUsers: (items: User[]) => storageService.save(KEYS.USERS, items),

  getRoles: () => storageService.get<Role>(KEYS.ROLES),
  saveRoles: (items: Role[]) => storageService.save(KEYS.ROLES, items),
};
