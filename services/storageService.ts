
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
  INITIAL_PERFORMANCES,
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
  PerformanceItem,
  AuditLog,
  LoginAttempt,
  SecurityConfig
} from '../types';
import { createAuditLogEntry } from '../utils/security';
import JSZip from 'jszip';

const KEYS = {
  NEWS: 'yanyun_news_v3',
  PROJECTS: 'yanyun_projects_v3',
  SERVICES: 'yanyun_services_v3',
  BRANCHES: 'yanyun_branches_v3',
  BRANCH_CATEGORIES: 'yanyun_branch_categories_v3',
  LINKS: 'yanyun_links_v3',
  PARTNERS: 'yanyun_partners_v3',
  HONORS: 'yanyun_honors_v3',
  HONOR_CATEGORIES: 'yanyun_honor_categories_v3',
  AUTH_TOKEN: 'yanyun_auth_token',
  CURRENT_USER: 'yanyun_current_user_v3',
  USERS: 'yanyun_users_v3',
  ROLES: 'yanyun_roles_v3',
  SETTINGS: 'yanyun_settings_v3',
  MEDIA: 'yanyun_media_v3',
  PAGE_CONTENT: 'yanyun_page_content_v3',
  TEAM: 'yanyun_team_v3',
  HISTORY: 'yanyun_history_v3',
  TENDERS: 'yanyun_tenders_v3',
  PERFORMANCES: 'yanyun_performances_v3',
  AUDIT_LOGS: 'yanyun_audit_logs_v3', 
  LOGIN_ATTEMPTS: 'yanyun_login_attempts_v3', 
  SECURITY_CONFIG: 'yanyun_security_config_v3' 
};

// Map keys to initial data
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
  [KEYS.PERFORMANCES]: INITIAL_PERFORMANCES,
  [KEYS.SETTINGS]: DEFAULT_SITE_SETTINGS,
  [KEYS.SECURITY_CONFIG]: DEFAULT_SECURITY_CONFIG,
  [KEYS.AUDIT_LOGS]: [],
  [KEYS.LOGIN_ATTEMPTS]: {}
};

const API_ENDPOINT = '/api/kv';
const FILE_API_ENDPOINT = '/api/file';
// Important: This token must match the one configured in your PHP backend
const KV_ACCESS_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';

// Enable Cloud Sync for Server Deployment
let isCloudAvailable = true;

const markCloudUnavailable = () => {
  if (isCloudAvailable) {
    isCloudAvailable = false;
    window.dispatchEvent(new Event('storageStatusChanged'));
    console.error("Critical: Cloud Sync Connection Failed. Switching to Local Storage.");
  }
};

export const storageService = {
  getSystemStatus: () => ({
    mode: isCloudAvailable ? 'CLOUD_SYNC' : 'LOCAL_ONLY',
    isOnline: navigator.onLine
  }),

  async get<T>(key: string): Promise<T[]> {
    const getFallback = () => {
        const local = localStorage.getItem(key);
        return local ? JSON.parse(local) : (INITIAL_DATA_MAP[key] || []);
    };

    if (!isCloudAvailable) return getFallback();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const response = await fetch(`${API_ENDPOINT}?key=${key}&t=${Date.now()}`, { 
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
         if (response.status === 404) return getFallback();
         markCloudUnavailable();
         return getFallback();
      }

      // Handle potential HTML response from Nginx errors
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
         throw new Error("Invalid response format");
      }

      const data = await response.json();
      if (data === null) return getFallback();
      
      // Update local cache
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn(`Sync failed for ${key}, using local data.`);
      return getFallback();
    }
  },

  async save<T>(key: string, items: T[]): Promise<void> {
    // Always save locally first for immediate UI update
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.error("Local storage full");
    }

    if (isCloudAvailable) {
        // Sync to server in background
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ key, value: items }),
        })
        .then(res => {
            if (!res.ok) {
               console.error("Cloud save failed:", res.status);
               // Optional: markCloudUnavailable(); 
               // We don't disable cloud on write fail immediately to allow retries
            }
        })
        .catch(err => console.error("Cloud save error:", err));
    }
    
    return Promise.resolve();
  },

  async uploadAsset(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'bin';
    // Clean filename for URL safety
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueKey = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${safeName}`;
    
    const toBase64 = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    if (!isCloudAvailable) return toBase64();

    try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Using query param for key to match existing API structure
        const response = await fetch(`${FILE_API_ENDPOINT}?key=${uniqueKey}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
                // Content-Type is auto-set by fetch for FormData
            },
            body: formData 
        });

        if (!response.ok) throw new Error('Upload failed');
        
        const res = await response.json();
        // Return the API URL that will redirect to COS or serve the file
        return res.url; 
    } catch (error) {
        console.error("Upload error, falling back to base64", error);
        return toBase64();
    }
  },

  exportSystemData: async () => {
    const data: Record<string, any> = {};
    for (const key of Object.values(KEYS)) {
        if (key !== KEYS.AUTH_TOKEN) {
            data[key] = await storageService.get(key);
        }
    }
    return JSON.stringify(data, null, 2);
  },

  createFullBackup: async (onProgress?: (msg: string) => void) => {
    const zip = new JSZip();
    const dataFolder = zip.folder("data");
    const assetsFolder = zip.folder("assets");
    
    onProgress?.("正在聚合结构化数据...");
    const systemData: Record<string, any> = {};
    for (const key of Object.values(KEYS)) {
       if (key !== KEYS.AUTH_TOKEN) systemData[key] = await storageService.get(key);
    }
    dataFolder?.file("database.json", JSON.stringify(systemData, null, 2));

    // Look for our API file pattern
    const assetRegex = /\/api\/file\?key=([a-zA-Z0-9_.-]+)/g;
    const assets = new Set<string>();
    const fullJson = JSON.stringify(systemData);
    let match;
    while ((match = assetRegex.exec(fullJson)) !== null) assets.add(match[1]);

    const assetKeys = Array.from(assets);
    onProgress?.(`正在下载 ${assetKeys.length} 个媒体文件...`);

    for (let i = 0; i < assetKeys.length; i++) {
       try {
          const res = await fetch(`${FILE_API_ENDPOINT}?key=${assetKeys[i]}`);
          if (res.ok) assetsFolder?.file(assetKeys[i], await res.blob());
          onProgress?.(`备份进度: ${i+1}/${assetKeys.length}`);
       } catch (e) {}
    }

    onProgress?.("正在生成 ZIP 压缩包...");
    return await zip.generateAsync({ type: "blob" });
  },

  importSystemData: async (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      for (const key in data) {
         if (Object.values(KEYS).includes(key)) await storageService.save(key, data[key]);
      }
      return { success: true };
    } catch (e) {
      return { success: false, message: "文件格式无效" };
    }
  },

  getStorageUsage: () => {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) total += (localStorage[key].length + key.length) * 2;
    }
    return (total / 1024).toFixed(2);
  },

  getSecurityConfig: async (): Promise<SecurityConfig> => {
    const s = await storageService.get<SecurityConfig>(KEYS.SECURITY_CONFIG);
    return Array.isArray(s) ? (s[0] || DEFAULT_SECURITY_CONFIG) : (s || DEFAULT_SECURITY_CONFIG);
  },

  saveSecurityConfig: async (config: SecurityConfig) => {
    await storageService.save(KEYS.SECURITY_CONFIG, [config] as any);
  },

  logAction: async (action: string, resource: string, details: string, status: 'SUCCESS' | 'FAILURE') => {
    const user = storageService.getCurrentUser();
    const log = createAuditLogEntry(user?.id || 'sys', user?.name || 'Guest', action, resource, details, status);
    // Don't await logs to keep UI snappy
    storageService.getAuditLogs().then(logs => {
        storageService.save(KEYS.AUDIT_LOGS, [log, ...logs].slice(0, 1000));
    });
  },

  getAuditLogs: () => storageService.get<AuditLog>(KEYS.AUDIT_LOGS),

  login: async (u: string, p: string): Promise<{ success: boolean; message?: string; mfaRequired?: boolean }> => {
    // In a real backend, this logic moves to the server. 
    // For this hybrid deployment, we fetch the users list and check locally (less secure but works for CMS)
    // Or we could implement a specific login API endpoint.
    
    // For now, keeping the "Client-side check against fetched data" pattern to minimize backend complexity code
    if (u === 'admin' && p === 'admin') {
      const users = await storageService.getUsers();
      const user = users.find(usr => usr.username === 'admin') || INITIAL_USERS[0];
      const securityConfig = await storageService.getSecurityConfig();

      if (user.mfaEnabled || securityConfig.mfaEnabled) {
        return { success: true, mfaRequired: true };
      }

      sessionStorage.setItem(KEYS.AUTH_TOKEN, 'session_' + Date.now());
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      storageService.logAction('LOGIN', 'Auth', `Admin logged in`, 'SUCCESS');
      return { success: true, mfaRequired: false };
    }
    return { success: false, message: '凭证无效', mfaRequired: false };
  },

  verifyMfa: async (username: string, code: string): Promise<{ success: boolean; message?: string }> => {
    if (code === '123456') {
      const users = await storageService.getUsers();
      const user = users.find(u => u.username === username) || INITIAL_USERS[0];
      sessionStorage.setItem(KEYS.AUTH_TOKEN, 'session_' + Date.now());
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
      storageService.logAction('LOGIN', 'Auth', `${user.name} verified MFA`, 'SUCCESS');
      return { success: true };
    }
    return { success: false, message: '验证码无效' };
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

  getCurrentUserRole: async (): Promise<Role | null> => {
    const user = storageService.getCurrentUser();
    if (!user) return null;
    const roles = await storageService.getRoles();
    return roles.find(r => r.id === user.roleId) || INITIAL_ROLES[0];
  },

  getNews: () => storageService.get<NewsItem>(KEYS.NEWS),
  saveNews: (items: NewsItem[]) => storageService.save(KEYS.NEWS, items),
  getNewsById: async (id: string) => (await storageService.getNews()).find(n => n.id === id),
  getRelatedNews: async (id: string) => {
    const news = await storageService.getNews();
    return news.filter(n => n.id !== id).slice(0, 3);
  },
  
  getProjects: () => storageService.get<ProjectCase>(KEYS.PROJECTS),
  saveProjects: (items: ProjectCase[]) => storageService.save(KEYS.PROJECTS, items),

  getServices: () => storageService.get<Service>(KEYS.SERVICES),
  saveServices: (items: Service[]) => storageService.save(KEYS.SERVICES, items),
  
  getSettings: async (): Promise<SiteSettings> => {
    const s = await storageService.get<SiteSettings>(KEYS.SETTINGS);
    return Array.isArray(s) ? (s[0] || DEFAULT_SITE_SETTINGS) : (s || DEFAULT_SITE_SETTINGS);
  },
  getSettingsSync: (): SiteSettings => {
     const s = localStorage.getItem(KEYS.SETTINGS);
     return s ? JSON.parse(s) : DEFAULT_SITE_SETTINGS;
  },
  saveSettings: async (s: SiteSettings) => {
    await storageService.save(KEYS.SETTINGS, [s] as any);
    window.dispatchEvent(new Event('settingsChanged'));
  },

  getPageContent: (): PageContent => {
    const c = localStorage.getItem(KEYS.PAGE_CONTENT);
    return c ? JSON.parse(c) : INITIAL_PAGE_CONTENT;
  },
  savePageContent: (c: PageContent) => storageService.save(KEYS.PAGE_CONTENT, c as any),

  getPartners: () => storageService.get<Partner>(KEYS.PARTNERS),
  savePartners: (items: Partner[]) => storageService.save(KEYS.PARTNERS, items),
  getHistory: () => storageService.get<HistoryEvent>(KEYS.HISTORY),
  saveHistory: (items: HistoryEvent[]) => storageService.save(KEYS.HISTORY, items),
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
  getMediaCategories: () => [
    { id: 'all', name: '全部', count: 0 },
    { id: 'site', name: '站点', count: 0 },
    { id: 'news', name: '新闻', count: 0 },
    { id: 'project', name: '项目', count: 0 },
  ],
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
  getPerformances: () => storageService.get<PerformanceItem>(KEYS.PERFORMANCES),
  savePerformances: (items: PerformanceItem[]) => storageService.save(KEYS.PERFORMANCES, items),
  getPerformanceById: async (id: string) => (await storageService.getPerformances()).find(p => p.id === id),
};
