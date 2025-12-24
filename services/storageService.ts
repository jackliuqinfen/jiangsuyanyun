
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
  safeInit(KEYS.BRANCH_CATEGORIES, INITIAL_BRANCH_CATEGORIES);
  safeInit(KEYS.LINKS, INITIAL_LINKS);
  safeInit(KEYS.PARTNERS, INITIAL_PARTNERS);
  safeInit(KEYS.HONORS, INITIAL_HONORS);
  safeInit(KEYS.HONOR_CATEGORIES, INITIAL_HONOR_CATEGORIES);
  
  // Settings initialization logic:
  // We only set the default if no settings exist. 
  // We do NOT overwrite enableAnniversary if it already exists, respecting the user's choice.
  const storedSettings = localStorage.getItem(KEYS.SETTINGS);
  if (!storedSettings) {
    // First time load: Default to enabled
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify({
        ...DEFAULT_SITE_SETTINGS,
        enableAnniversary: true 
    }));
  } else {
    // Migration: If settings exist but enableAnniversary is missing (from older version), add it
    const parsed = JSON.parse(storedSettings);
    if (parsed.enableAnniversary === undefined) {
        const merged = { ...parsed, enableAnniversary: true };
        localStorage.setItem(KEYS.SETTINGS, JSON.stringify(merged));
    }
  }

  safeInit(KEYS.ROLES, INITIAL_ROLES);
  safeInit(KEYS.USERS, INITIAL_USERS);
  safeInit(KEYS.MEDIA, INITIAL_MEDIA);
  safeInit(KEYS.PAGE_CONTENT, INITIAL_PAGE_CONTENT);
  safeInit(KEYS.TEAM, INITIAL_TEAM);
  safeInit(KEYS.HISTORY, COMPANY_HISTORY);
  safeInit(KEYS.TENDERS, INITIAL_TENDERS);
  safeInit(KEYS.AUDIT_LOGS, [] as AuditLog[]);
  safeInit(KEYS.LOGIN_ATTEMPTS, {} as Record<string, LoginAttempt>);
  safeInit(KEYS.SECURITY_CONFIG, DEFAULT_SECURITY_CONFIG);
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
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        throw new Error("浏览器存储空间已满。由于演示系统使用本地缓存，上传过多大图可能导致此错误。请尝试删除部分媒体资源或使用更小的图片（建议<500KB）。");
      }
      console.error("Storage Save Error:", e);
      throw new Error("保存失败，请稍后重试。");
    }
  },

  // --- Security & Auth (Enhanced) ---

  getSecurityConfig: (): SecurityConfig => {
    const s = localStorage.getItem(KEYS.SECURITY_CONFIG);
    return s ? JSON.parse(s) : DEFAULT_SECURITY_CONFIG;
  },

  saveSecurityConfig: (config: SecurityConfig) => {
    localStorage.setItem(KEYS.SECURITY_CONFIG, JSON.stringify(config));
    // Log this action
    storageService.logAction('Update Security Config', 'Settings', 'Updated global security policies', 'SUCCESS');
  },

  logAction: (action: string, resource: string, details: string, status: 'SUCCESS' | 'FAILURE') => {
    const currentUser = storageService.getCurrentUser();
    const log = createAuditLogEntry(
      currentUser?.id || 'system',
      currentUser?.name || 'System/Guest',
      action,
      resource,
      details,
      status
    );
    const logs = JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify([log, ...logs].slice(0, 1000))); // Keep last 1000
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    await delay();
    return JSON.parse(localStorage.getItem(KEYS.AUDIT_LOGS) || '[]');
  },

  login: async (username: string, passwordInput: string): Promise<{success: boolean, token?: string, mfaRequired?: boolean, message?: string}> => {
    await delay(800);
    
    const config = storageService.getSecurityConfig();
    const loginAttempts = JSON.parse(localStorage.getItem(KEYS.LOGIN_ATTEMPTS) || '{}') as Record<string, LoginAttempt>;
    const userAttempt = loginAttempts[username] || { count: 0, lastAttempt: 0, isLocked: false, lockUntil: 0 };

    // 1. Check Lockout
    if (userAttempt.isLocked) {
      if (Date.now() < userAttempt.lockUntil) {
        storageService.logAction('LOGIN_LOCKED', 'Auth', `Login attempted on locked account: ${username}`, 'FAILURE');
        return { success: false, message: `账户已锁定，请在 ${Math.ceil((userAttempt.lockUntil - Date.now()) / 60000)} 分钟后重试` };
      } else {
        // Unlock
        userAttempt.isLocked = false;
        userAttempt.count = 0;
      }
    }

    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.username === username);

    // 2. Validate Credentials (Simulation - in real app, hash compare)
    // Note: The demo hardcodes password 'admin' for simplicity in `Login.tsx` previously, 
    // but here we simulate a check. For the default admin, let's assume 'admin' is the pass.
    const isValidPass = user && passwordInput === 'admin'; 

    if (isValidPass) {
      // Reset attempts on success
      loginAttempts[username] = { count: 0, lastAttempt: Date.now(), isLocked: false, lockUntil: 0 };
      localStorage.setItem(KEYS.LOGIN_ATTEMPTS, JSON.stringify(loginAttempts));

      // 3. MFA Check
      if (user.mfaEnabled || config.mfaEnabled) {
        // Return intermediate state
        return { success: true, mfaRequired: true };
      }

      // 4. Success Token Generation
      const mockToken = `ey-session-${Date.now()}-${Math.random().toString(36).substr(2)}`;
      sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      
      // Update last login
      const updatedUsers = users.map((u: User) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
      localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));

      storageService.logAction('LOGIN', 'Auth', `User ${username} logged in successfully`, 'SUCCESS');
      return { success: true, token: mockToken };
    } else {
      // 5. Handle Failure & Locking
      userAttempt.count += 1;
      userAttempt.lastAttempt = Date.now();
      
      if (userAttempt.count >= config.maxLoginAttempts) {
        userAttempt.isLocked = true;
        userAttempt.lockUntil = Date.now() + (config.lockoutDurationMinutes * 60 * 1000);
        storageService.logAction('LOGIN_LOCKOUT', 'Auth', `Account ${username} locked due to too many failed attempts`, 'FAILURE');
      } else {
        storageService.logAction('LOGIN_FAILED', 'Auth', `Failed login attempt for ${username}`, 'FAILURE');
      }
      
      localStorage.setItem(KEYS.LOGIN_ATTEMPTS, JSON.stringify(loginAttempts));
      return { success: false, message: userAttempt.isLocked ? '尝试次数过多，账户已锁定' : '用户名或密码错误' };
    }
  },

  verifyMfa: async (username: string, code: string): Promise<{success: boolean, token?: string, message?: string}> => {
    await delay(500);
    // Simulation: Any 6 digit code works for demo
    if (code.length === 6 && /^\d+$/.test(code)) {
       const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
       const user = users.find((u: User) => u.username === username);
       
       if (user) {
          const mockToken = `ey-session-${Date.now()}-${Math.random().toString(36).substr(2)}`;
          sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
          localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
          storageService.logAction('MFA_VERIFY', 'Auth', `MFA verified for ${username}`, 'SUCCESS');
          return { success: true, token: mockToken };
       }
    }
    storageService.logAction('MFA_FAILED', 'Auth', `Invalid MFA code for ${username}`, 'FAILURE');
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

  getCurrentUserRole: (): Role | null => {
    const user = storageService.getCurrentUser();
    if (!user) return null;
    const roles = JSON.parse(localStorage.getItem(KEYS.ROLES) || '[]');
    return roles.find((r: Role) => r.id === user.roleId) || null;
  },

  // 业务模型访问层
  getNews: () => storageService.get<NewsItem>(KEYS.NEWS),
  saveNews: (items: NewsItem[]) => {
    storageService.logAction('UPDATE', 'News', `Updated news list (${items.length} items)`, 'SUCCESS');
    return storageService.save(KEYS.NEWS, items);
  },
  getNewsById: async (id: string) => (await storageService.getNews()).find(n => n.id === id),
  getRelatedNews: async (id: string) => {
    const news = await storageService.getNews();
    const current = news.find(n => n.id === id);
    if (!current) return [];
    return news.filter(n => n.id !== id && n.category === current.category).slice(0, 3);
  },
  
  getProjects: () => storageService.get<ProjectCase>(KEYS.PROJECTS),
  saveProjects: (items: ProjectCase[]) => {
    storageService.logAction('UPDATE', 'Projects', `Updated projects list`, 'SUCCESS');
    return storageService.save(KEYS.PROJECTS, items);
  },

  getServices: () => storageService.get<Service>(KEYS.SERVICES),
  saveServices: (items: Service[]) => storageService.save(KEYS.SERVICES, items),
  
  getSettings: (): SiteSettings => {
    const s = localStorage.getItem(KEYS.SETTINGS);
    return s ? JSON.parse(s) : DEFAULT_SITE_SETTINGS;
  },
  saveSettings: (s: SiteSettings) => {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(s));
    storageService.logAction('UPDATE', 'Settings', 'Updated global site settings', 'SUCCESS');
    window.dispatchEvent(new Event('settingsChanged'));
  },

  getPageContent: (): PageContent => {
    const c = localStorage.getItem(KEYS.PAGE_CONTENT);
    return c ? JSON.parse(c) : INITIAL_PAGE_CONTENT;
  },
  savePageContent: (c: PageContent) => {
    storageService.logAction('UPDATE', 'Pages', 'Updated page content configuration', 'SUCCESS');
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
  saveUsers: (items: User[]) => {
    storageService.logAction('UPDATE', 'Users', 'Modified user list', 'SUCCESS');
    return storageService.save(KEYS.USERS, items);
  },

  getRoles: () => storageService.get<Role>(KEYS.ROLES),
  saveRoles: (items: Role[]) => {
    storageService.logAction('UPDATE', 'Roles', 'Modified RBAC role definitions', 'SUCCESS');
    return storageService.save(KEYS.ROLES, items);
  },

  getTenders: () => storageService.get<TenderItem>(KEYS.TENDERS),
  saveTenders: (items: TenderItem[]) => {
    storageService.logAction('UPDATE', 'Tenders', `Updated tenders list`, 'SUCCESS');
    return storageService.save(KEYS.TENDERS, items);
  },
  getTenderById: async (id: string) => (await storageService.getTenders()).find(t => t.id === id),
};
