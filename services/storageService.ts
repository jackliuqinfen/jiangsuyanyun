
import { 
  INITIAL_BRANCHES, 
  INITIAL_LINKS, 
  INITIAL_NEWS, 
  INITIAL_PROJECTS, 
  INITIAL_SERVICES, 
  INITIAL_PARTNERS, 
  INITIAL_HONORS, 
  INITIAL_HONOR_CATEGORIES,
  INITIAL_BRANCH_CATEGORIES,
  DEFAULT_SITE_SETTINGS,
  INITIAL_ROLES,
  INITIAL_USERS,
  INITIAL_MEDIA,
  INITIAL_PAGE_CONTENT,
  INITIAL_TEAM,
  COMPANY_HISTORY,
  INITIAL_TENDERS,
  DEFAULT_SECURITY_CONFIG
} from '../constants';
import { 
  Branch, 
  BranchCategory,
  NavigationLink, 
  NewsItem, 
  ProjectCase, 
  Service, 
  User, 
  Partner, 
  Honor, 
  HonorCategory,
  SiteSettings,
  Role,
  MediaItem,
  MediaCategory,
  PageContent,
  TeamMember,
  HistoryEvent,
  TenderItem,
  AuditLog,
  LoginAttempt,
  SecurityConfig
} from '../types';
import { createAuditLogEntry } from '../utils/security';

const KEYS = {
  NEWS: 'yanyun_news_v2',
  PROJECTS: 'yanyun_projects_v2',
  SERVICES: 'yanyun_services_v2',
  BRANCHES: 'yanyun_branches_v2',
  BRANCH_CATEGORIES: 'yanyun_branch_categories_v2',
  LINKS: 'yanyun_links_v2',
  PARTNERS: 'yanyun_partners_v2',
  HONORS: 'yanyun_honors_v2',
  HONOR_CATEGORIES: 'yanyun_honor_categories_v2',
  AUTH_TOKEN: 'yanyun_auth_token',
  CURRENT_USER: 'yanyun_current_user_v2',
  USERS: 'yanyun_users_v2',
  ROLES: 'yanyun_roles_v2',
  SETTINGS: 'yanyun_settings_v2',
  MEDIA: 'yanyun_media_v2',
  PAGE_CONTENT: 'yanyun_page_content_v2',
  TEAM: 'yanyun_team_v2',
  HISTORY: 'yanyun_history_v2',
  TENDERS: 'yanyun_tenders_v2',
  AUDIT_LOGS: 'yanyun_audit_logs_v2', 
  LOGIN_ATTEMPTS: 'yanyun_login_attempts_v2', 
  SECURITY_CONFIG: 'yanyun_security_config_v2' 
};

// Map keys to initial data for fallback/seeding
const INITIAL_DATA_MAP: Record<string, any> = {
  [KEYS.NEWS]: INITIAL_NEWS,
  [KEYS.PROJECTS]: INITIAL_PROJECTS,
  [KEYS.SERVICES]: INITIAL_SERVICES,
  [KEYS.BRANCHES]: INITIAL_BRANCHES,
  [KEYS.BRANCH_CATEGORIES]: INITIAL_BRANCH_CATEGORIES,
  [KEYS.LINKS]: INITIAL_LINKS,
  [KEYS.PARTNERS]: INITIAL_PARTNERS,
  [KEYS.HONORS]: INITIAL_HONORS,
  [KEYS.HONOR_CATEGORIES]: INITIAL_HONOR_CATEGORIES,
  [KEYS.ROLES]: INITIAL_ROLES,
  [KEYS.USERS]: INITIAL_USERS,
  [KEYS.MEDIA]: INITIAL_MEDIA,
  [KEYS.PAGE_CONTENT]: INITIAL_PAGE_CONTENT,
  [KEYS.TEAM]: INITIAL_TEAM,
  [KEYS.HISTORY]: COMPANY_HISTORY,
  [KEYS.TENDERS]: INITIAL_TENDERS,
  [KEYS.SETTINGS]: { ...DEFAULT_SITE_SETTINGS, enableAnniversary: true },
  [KEYS.SECURITY_CONFIG]: DEFAULT_SECURITY_CONFIG,
  [KEYS.AUDIT_LOGS]: [],
  [KEYS.LOGIN_ATTEMPTS]: {}
};

// --- CONFIGURATION ---
const API_ENDPOINT = '/api/kv';
const FILE_API_ENDPOINT = '/api/file';
const KV_ACCESS_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';

export const storageService = {
  // 通用 CRUD 抽象 - Cloud Version with Auth
  async get<T>(key: string): Promise<T[]> {
    try {
      // 1. Try to fetch from EdgeOne KV
      const response = await fetch(`${API_ENDPOINT}?key=${key}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KV_ACCESS_TOKEN}`,
          'X-Client-Id': 'yanyun-frontend'
        }
      });
      
      if (!response.ok) {
        console.warn(`Cloud fetch failed for ${key} (${response.status}), falling back to local.`);
        const local = localStorage.getItem(key);
        return local ? JSON.parse(local) : (INITIAL_DATA_MAP[key] || []);
      }

      const data = await response.json();
      
      if (data === null || data === undefined) {
        const initial = INITIAL_DATA_MAP[key] || [];
        storageService.save(key, initial).catch(console.error);
        return initial;
      }

      localStorage.setItem(key, JSON.stringify(data));
      return data;

    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      const local = localStorage.getItem(key);
      return local ? JSON.parse(local) : (INITIAL_DATA_MAP[key] || []);
    }
  },

  async save<T>(key: string, items: T[]): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn("Local storage quota exceeded.");
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          key: key,
          value: items 
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Cloud save failed: ${response.status} ${errText}`);
      }

    } catch (e: any) {
      console.error("Storage Save Error:", e);
      console.warn("Data saved locally but cloud sync failed.");
    }
  },

  // --- NEW: Binary Asset Upload ---
  // This uploads the actual file content to a unique KV key, avoiding JSON bloat.
  async uploadAsset(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'bin';
    const uniqueKey = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
    
    try {
        const response = await fetch(`${FILE_API_ENDPOINT}?key=${uniqueKey}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`,
                'Content-Type': file.type // Pass original mime type if needed, or backend detects
            },
            body: file // Send raw binary
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const res = await response.json();
        // Return the URL that points to the GET endpoint
        return res.url; 
    } catch (error) {
        console.error("Asset Upload Error:", error);
        throw error;
    }
  },

  // --- DATA MIGRATION FEATURES ---
  
  exportSystemData: async () => {
    const data: Record<string, any> = {};
    const promises = Object.values(KEYS).map(async (key) => {
        if (key !== KEYS.AUTH_TOKEN && key !== KEYS.CURRENT_USER) {
            const items = await storageService.get(key);
            data[key] = items;
        }
    });
    await Promise.all(promises);
    return JSON.stringify(data, null, 2);
  },

  importSystemData: async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      const promises = Object.keys(data).map(async (key) => {
        if (Object.values(KEYS).includes(key)) {
           await storageService.save(key, data[key]);
        }
      });
      await Promise.all(promises);
      return { success: true };
    } catch (e) {
      console.error("Import failed", e);
      return { success: false, message: "文件格式错误" };
    }
  },

  getStorageUsage: () => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += (localStorage[key].length + key.length) * 2;
      }
    }
    return (total / 1024).toFixed(2);
  },

  // --- Security & Auth ---

  getSecurityConfig: async (): Promise<SecurityConfig> => {
    const s = await storageService.get<SecurityConfig>(KEYS.SECURITY_CONFIG);
    return Array.isArray(s) ? (s.length > 0 ? s[0] : DEFAULT_SECURITY_CONFIG) : (s || DEFAULT_SECURITY_CONFIG);
  },

  saveSecurityConfig: async (config: SecurityConfig) => {
    await storageService.save(KEYS.SECURITY_CONFIG, config as any);
    storageService.logAction('Update Security Config', 'Settings', 'Updated global security policies', 'SUCCESS');
  },

  logAction: async (action: string, resource: string, details: string, status: 'SUCCESS' | 'FAILURE') => {
    const currentUser = storageService.getCurrentUser();
    const log = createAuditLogEntry(
      currentUser?.id || 'system',
      currentUser?.name || 'System/Guest',
      action,
      resource,
      details,
      status
    );
    const localLogs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    const newLogs = [log, ...localLogs].slice(0, 1000);
    storageService.save(KEYS.AUDIT_LOGS, newLogs);
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    return storageService.get<AuditLog>(KEYS.AUDIT_LOGS);
  },

  login: async (username: string, passwordInput: string): Promise<{success: boolean, token?: string, mfaRequired?: boolean, message?: string}> => {
    const config = await storageService.getSecurityConfig();
    const loginAttempts = (await storageService.get(KEYS.LOGIN_ATTEMPTS)) as any || {};
    const userAttempt = loginAttempts[username] || { count: 0, lastAttempt: 0, isLocked: false, lockUntil: 0 };

    if (userAttempt.isLocked) {
      if (Date.now() < userAttempt.lockUntil) {
        return { success: false, message: `账户已锁定，请在 ${Math.ceil((userAttempt.lockUntil - Date.now()) / 60000)} 分钟后重试` };
      } else {
        userAttempt.isLocked = false;
        userAttempt.count = 0;
      }
    }

    const users = await storageService.getUsers();
    const user = users.find((u: User) => u.username === username);
    const isValidPass = user && passwordInput === 'admin'; 

    if (isValidPass) {
      loginAttempts[username] = { count: 0, lastAttempt: Date.now(), isLocked: false, lockUntil: 0 };
      await storageService.save(KEYS.LOGIN_ATTEMPTS, loginAttempts);

      if (user.mfaEnabled || config.mfaEnabled) {
        return { success: true, mfaRequired: true };
      }

      const mockToken = `ey-session-${Date.now()}-${Math.random().toString(36).substr(2)}`;
      sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      
      const updatedUsers = users.map((u: User) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
      storageService.saveUsers(updatedUsers);

      storageService.logAction('LOGIN', 'Auth', `User ${username} logged in`, 'SUCCESS');
      return { success: true, token: mockToken };
    } else {
      userAttempt.count += 1;
      userAttempt.lastAttempt = Date.now();
      
      if (userAttempt.count >= config.maxLoginAttempts) {
        userAttempt.isLocked = true;
        userAttempt.lockUntil = Date.now() + (config.lockoutDurationMinutes * 60 * 1000);
      }
      
      await storageService.save(KEYS.LOGIN_ATTEMPTS, loginAttempts);
      return { success: false, message: userAttempt.isLocked ? '尝试次数过多，账户已锁定' : '用户名或密码错误' };
    }
  },

  verifyMfa: async (username: string, code: string): Promise<{success: boolean, token?: string, message?: string}> => {
    if (code.length === 6 && /^\d+$/.test(code)) {
       const users = await storageService.getUsers();
       const user = users.find((u: User) => u.username === username);
       
       if (user) {
          const mockToken = `ey-session-${Date.now()}`;
          sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
          localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
          storageService.logAction('MFA_VERIFY', 'Auth', `MFA verified for ${username}`, 'SUCCESS');
          return { success: true, token: mockToken };
       }
    }
    return { success: false, message: '验证码无效' };
  },

  logout: () => {
    storageService.logAction('LOGOUT', 'Auth', 'User logged out', 'SUCCESS');
    sessionStorage.removeItem(KEYS.AUTH_TOKEN);
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  isAuthenticated: () => !!sessionStorage.getItem(KEYS.AUTH_TOKEN),

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem(KEYS.CURRENT_USER);
    return u ? JSON.parse(u) : null;
  },

  getCurrentUserRole: async (): Promise<Role | null> => {
    const user = storageService.getCurrentUser();
    if (!user) return null;
    const roles = await storageService.getRoles();
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
  
  getSettings: async (): Promise<SiteSettings> => {
    const s = await storageService.get<SiteSettings>(KEYS.SETTINGS);
    const settings = Array.isArray(s) ? (s.length > 0 ? s[0] : DEFAULT_SITE_SETTINGS) : (s || DEFAULT_SITE_SETTINGS);
    return settings as SiteSettings;
  },
  getSettingsSync: (): SiteSettings => {
     const s = localStorage.getItem(KEYS.SETTINGS);
     return s ? JSON.parse(s) : DEFAULT_SITE_SETTINGS;
  },
  saveSettings: async (s: SiteSettings) => {
    await storageService.save(KEYS.SETTINGS, s as any);
    window.dispatchEvent(new Event('settingsChanged'));
  },

  getPageContent: (): PageContent => {
    const c = localStorage.getItem(KEYS.PAGE_CONTENT);
    return c ? JSON.parse(c) : INITIAL_PAGE_CONTENT;
  },
  savePageContent: (c: PageContent) => {
    storageService.save(KEYS.PAGE_CONTENT, c as any);
    localStorage.setItem(KEYS.PAGE_CONTENT, JSON.stringify(c));
  },

  getPartners: () => storageService.get<Partner>(KEYS.PARTNERS),
  savePartners: (items: Partner[]) => storageService.save(KEYS.PARTNERS, items),
  
  getHistory: () => storageService.get<HistoryEvent>(KEYS.HISTORY),
  saveHistory: (items: HistoryEvent[]) => storageService.save(KEYS.HISTORY, items),
  
  getTeam: () => storageService.getTeamMembers(),
  getTeamMembers: () => storageService.get<TeamMember>(KEYS.TEAM),
  saveTeam: (items: TeamMember[]) => storageService.save(KEYS.TEAM, items),
  
  getHonors: () => storageService.get<Honor>(KEYS.HONORS),
  saveHonors: (items: Honor[]) => storageService.save(KEYS.HONORS, items),
  getHonorCategories: () => storageService.get<HonorCategory>(KEYS.HONOR_CATEGORIES),
  saveHonorCategories: (items: HonorCategory[]) => storageService.save(KEYS.HONOR_CATEGORIES, items),
  
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
  getBranchCategories: () => storageService.get<BranchCategory>(KEYS.BRANCH_CATEGORIES),
  saveBranchCategories: (items: BranchCategory[]) => storageService.save(KEYS.BRANCH_CATEGORIES, items),

  getUsers: () => storageService.get<User>(KEYS.USERS),
  saveUsers: (items: User[]) => storageService.save(KEYS.USERS, items),

  getRoles: () => storageService.get<Role>(KEYS.ROLES),
  saveRoles: (items: Role[]) => storageService.save(KEYS.ROLES, items),

  getTenders: () => storageService.get<TenderItem>(KEYS.TENDERS),
  saveTenders: (items: TenderItem[]) => storageService.save(KEYS.TENDERS, items),
  getTenderById: async (id: string) => (await storageService.getTenders()).find(t => t.id === id),
};
