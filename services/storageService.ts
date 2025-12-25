
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
  INITIAL_PERFORMANCES, // Added
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
  PerformanceItem, // Added
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
  PERFORMANCES: 'yanyun_performances_v3', // Added
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
  [KEYS.PERFORMANCES]: INITIAL_PERFORMANCES, // Added
  [KEYS.SETTINGS]: DEFAULT_SITE_SETTINGS,
  [KEYS.SECURITY_CONFIG]: DEFAULT_SECURITY_CONFIG,
  [KEYS.AUDIT_LOGS]: [],
  [KEYS.LOGIN_ATTEMPTS]: {}
};

const API_ENDPOINT = '/api/kv';
const FILE_API_ENDPOINT = '/api/file';
const KV_ACCESS_TOKEN = '8CG4Q0zhUzrvt14hsymoLNa+SJL9ioImlqabL5R+fJA=';

// Deployment Fix: Default to FALSE to ensure LocalStorage works immediately on static hosts.
// Only set this to true if you have deployed the Edge Functions to Cloudflare/EdgeOne.
let isCloudAvailable = false;

const markCloudUnavailable = () => {
  if (isCloudAvailable) {
    isCloudAvailable = false;
    window.dispatchEvent(new Event('storageStatusChanged'));
    console.error("Critical: Cloud Sync Terminal Error. Switching to Hard-LocalStorage Mode.");
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
      const timeoutId = setTimeout(() => controller.abort(), 2000);

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

      // Deployment Fix: Check content type to avoid parsing HTML as JSON (common SPA issue)
      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.includes("application/json")) {
         markCloudUnavailable();
         return getFallback();
      }

      const data = await response.json();
      if (data === null) return getFallback();
      
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch (error) {
      // Network error or JSON parse error
      markCloudUnavailable();
      return getFallback();
    }
  },

  async save<T>(key: string, items: T[]): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      alert("本地存储空间不足，请在『系统设置』中导出备份并清理旧数据。");
      throw e;
    }

    if (isCloudAvailable) {
        fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ key, value: items }),
        })
        .then(res => {
            if (!res.ok && res.status !== 404) markCloudUnavailable();
        })
        .catch(() => {});
    }
    
    return Promise.resolve();
  },

  async uploadAsset(file: File): Promise<string> {
    const ext = file.name.split('.').pop() || 'bin';
    const uniqueKey = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${ext}`;
    
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
        const response = await fetch(`${FILE_API_ENDPOINT}?key=${uniqueKey}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_ACCESS_TOKEN}`,
                'Content-Type': file.type
            },
            body: file 
        });

        if (!response.ok) throw new Error('Upload failed');
        const res = await response.json();
        return res.url; 
    } catch (error) {
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
    for (const