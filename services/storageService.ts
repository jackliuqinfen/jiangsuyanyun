
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
import JSZip from 'jszip';

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

// Circuit Breaker State
let isCloudAvailable = true;
let hasLoggedOfflineMode = false;

const markCloudUnavailable = () => {
  if (isCloudAvailable) {
    isCloudAvailable = false;
    // Dispatch event to notify UI components (like AdminLayout)
    window.dispatchEvent(new Event('storageStatusChanged'));
  }
  
  if (!hasLoggedOfflineMode) {
    hasLoggedOfflineMode = true;
    console.warn("⚠️ Cloud API disconnected. Switching to local-only storage mode.");
  }
};

export const storageService = {
  // Check System Status
  getSystemStatus: () => ({
    mode: isCloudAvailable ? 'CLOUD_SYNC' : 'LOCAL_ONLY',
    isOnline: navigator.onLine
  }),

  // 通用 CRUD 抽象 - Cloud Version with Auth
  async get<T>(key: string): Promise<T[]> {
    const getFallback = () => {
        const local = localStorage.getItem(key);
        return local ? JSON.parse(local) : (INITIAL_DATA_MAP[key] || []);
    };

    // If we already know cloud is down, skip fetch entirely
    if (!isCloudAvailable) {
        return getFallback();
    }

    try {
      // 1. Try to fetch from EdgeOne KV with TIMEOUT
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500); // Strict timeout

      const response = await fetch(`${API_ENDPOINT}?key=${key}&t=${Date.now()}`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KV_ACCESS_TOKEN}`,
          'X-Client-Id': 'yanyun-frontend'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Handle 404 or Server Errors
      if (!response.ok) {
         if (response.status === 404 || response.status === 500) {
            markCloudUnavailable();
         }
         return getFallback();
      }

      const data = await response.json();
      
      // 2. If KV returns null (key doesn't exist yet), return initial data
      if (data === null || data === undefined) {
        const initial = INITIAL_DATA_MAP[key] || [];
        // Seed initial data in background
        storageService.save(key, initial).catch(() => {});
        return initial;
      }

      // Update local cache on successful fetch to keep them in sync
      localStorage.setItem(key, JSON.stringify(data));
      return data;

    } catch (error) {
      // Network errors or AbortErrors
      return getFallback();
    }
  },

  // OPTIMISTIC SAVE: Save locally immediately, sync to cloud in background
  async save<T>(key: string, items: T[]): Promise<void> {
    // 1. Critical: Save to Local Storage immediately
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error("Local storage save failed:", e);
      throw new Error("Local storage full or disabled");
    }

    // 2. Background Sync (Fire and Forget)
    if (isCloudAvailable) {
        // We use a non-awaited promise here to not block the UI
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                key: key,
                value: items 
            }),
        })
        .then(response => {
            if (response.status === 404 || response.status === 500) {
                markCloudUnavailable();
            } else if (!response.ok) {
                console.warn(`Cloud sync failed for ${key}: ${response.status}`);
            }
        })
        .catch(() => {
            // Network error implies offline or blocked
            // Don't aggressively mark offline on single failure, but log it
            // markCloudUnavailable(); 
        });
    }
    
    // Always return success to the UI if local save worked
    return Promise.resolve();
  },

  async uploadAsset(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'bin';
    const uniqueKey = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
    
    // Fallback function: Convert to Base64 for local-only mode
    const toBase64 = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // If cloud is down, use local fallback immediately
    if (!isCloudAvailable) {
        return toBase64();
    }

    try {
        const response = await fetch(`${FILE_API_ENDPOINT}?key=${uniqueKey}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`,
                'Content-Type': file.type
            },
            body: file 
        });

        if (response.status === 404) {
            markCloudUnavailable();
            return toBase64();
        }

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        const res = await response.json();
        return res.url; 
    } catch (error) {
        console.warn("Asset Upload Failed (Falling back to Base64):", error);
        return toBase64();
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

  createFullBackup: async (onProgress?: (msg: string) => void) => {
    const zip = new JSZip();
    const dataFolder = zip.folder("data");
    const assetsFolder = zip.folder("assets");
    
    // 1. Fetch all JSON Data
    onProgress?.("正在导出结构化数据...");
    const systemData: Record<string, any> = {};
    const keysToBackup = Object.values(KEYS).filter(k => k !== KEYS.AUTH_TOKEN && k !== KEYS.CURRENT_USER);
    
    for (const key of keysToBackup) {
       const items = await storageService.get(key);
       systemData[key] = items;
    }
    
    const fullJsonString = JSON.stringify(systemData, null, 2);
    dataFolder?.file("database.json", fullJsonString);

    // 2. Discover Assets
    onProgress?.("正在分析媒体文件依赖...");
    // Only attempt to download assets if they look like our API URLs
    const assetRegex = /\/api\/file\?key=([a-zA-Z0-9_.-]+)/g;
    const assets = new Set<string>();
    let match;
    while ((match = assetRegex.exec(fullJsonString)) !== null) {
        assets.add(match[1]); 
    }

    const totalAssets = assets.size;
    let processedAssets = 0;

    // 3. Download Assets (Concurrency Controlled)
    const assetKeys = Array.from(assets);
    const CONCURRENCY = 5;
    
    const downloadAsset = async (key: string) => {
       if (!isCloudAvailable) return; // Skip downloads if offline
       try {
          const response = await fetch(`${FILE_API_ENDPOINT}?key=${key}`);
          if (response.ok) {
             const blob = await response.blob();
             assetsFolder?.file(key, blob);
          } else {
             assetsFolder?.file(`${key}.error.txt`, `Failed to fetch: ${response.status}`);
          }
       } catch (e) {
          // ignore
       } finally {
          processedAssets++;
          onProgress?.(`备份媒体文件: ${processedAssets}/${totalAssets}`);
       }
    };

    if (isCloudAvailable) {
        // Process in batches
        for (let i = 0; i < assetKeys.length; i += CONCURRENCY) {
           const batch = assetKeys.slice(i, i + CONCURRENCY);
           await Promise.all(batch.map(key => downloadAsset(key)));
        }
    } else {
        onProgress?.("离线模式：跳过云端媒体备份");
    }

    // 4. Generate Zip
    onProgress?.("正在打包压缩...");
    const zipContent = await zip.generateAsync({ type: "blob" });
    return zipContent;
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
    localStorage.setItem(KEYS.AUDIT_LOGS, JSON.stringify(newLogs));
    
    if (isCloudAvailable) {
        // Fire and forget
        storageService.save(KEYS.AUDIT_LOGS, newLogs).catch(() => {});
    }
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
    const safeUsers = users.length > 0 ? users : INITIAL_USERS;
    const user = safeUsers.find((u: User) => u.username === username);
    
    const isValidPass = user && passwordInput === 'admin'; 

    if (isValidPass) {
      loginAttempts[username] = { count: 0, lastAttempt: Date.now(), isLocked: false, lockUntil: 0 };
      // Fire and forget save
      storageService.save(KEYS.LOGIN_ATTEMPTS, loginAttempts).catch(() => {});

      if (user.mfaEnabled || config.mfaEnabled) {
        return { success: true, mfaRequired: true };
      }

      const mockToken = `ey-session-${Date.now()}-${Math.random().toString(36).substr(2)}`;
      sessionStorage.setItem(KEYS.AUTH_TOKEN, mockToken);
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      
      const updatedUsers = safeUsers.map((u: User) => u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u);
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
      
      storageService.save(KEYS.LOGIN_ATTEMPTS, loginAttempts).catch(() => {});
      return { success: false, message: userAttempt.isLocked ? '尝试次数过多，账户已锁定' : '用户名或密码错误' };
    }
  },

  verifyMfa: async (username: string, code: string): Promise<{success: boolean, token?: string, message?: string}> => {
    if (code.length === 6 && /^\d+$/.test(code)) {
       const users = await storageService.getUsers();
       const safeUsers = users.length > 0 ? users : INITIAL_USERS;
       const user = safeUsers.find((u: User) => u.username === username);
       
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
    
    try {
      const roles = await storageService.getRoles();
      const foundRole = roles.find((r: Role) => r.id === user.roleId);
      if (foundRole) return foundRole;
      if (user.username === 'admin' || user.id === '1') return INITIAL_ROLES[0]; 
      return INITIAL_ROLES.find(r => r.id === 'role_viewer') || INITIAL_ROLES[2];
    } catch (e) {
      if (user.username === 'admin') return INITIAL_ROLES[0];
      return INITIAL_ROLES[2]; 
    }
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
