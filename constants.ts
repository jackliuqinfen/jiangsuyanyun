
import { Branch, BranchCategory, HistoryEvent, Honor, HonorCategory, NavigationLink, NewsItem, Partner, ProjectCase, Role, Service, SiteSettings, TeamMember, Testimonial, User, ResourceType, MediaItem, PageContent, TenderItem, SecurityConfig, FooterLink, HomeSectionConfig, PageHeaderConfig, PerformanceItem } from './types';

// Helper to create full permissions
const fullAccess = { read: true, write: true, delete: true };

export const RESOURCES: {id: ResourceType, label: string}[] = [
  { id: 'pages', label: '页面内容' },
  { id: 'news', label: '新闻动态' },
  { id: 'tenders', label: '招标信息' },
  { id: 'performances', label: '公司业绩' },
  { id: 'projects', label: '项目案例' },
  { id: 'services', label: '业务服务' },
  { id: 'branches', label: '分支机构' },
  { id: 'partners', label: '合作伙伴' },
  { id: 'honors', label: '荣誉资质' },
  { id: 'team', label: '核心团队' },
  { id: 'history', label: '发展历程' },
  { id: 'navigation', label: '网址导航' },
  { id: 'media', label: '媒体资源' },
  { id: 'users', label: '用户与权限' },
  { id: 'settings', label: '系统设置' },
  { id: 'security', label: '安全合规审计' },
];

export const INITIAL_ROLES: Role[] = [
  {
    id: 'role_admin',
    name: '超级管理员',
    description: '拥有系统所有功能的操作权限',
    isSystem: true,
    permissions: {
      pages: fullAccess, news: fullAccess, tenders: fullAccess, performances: fullAccess, projects: fullAccess, services: fullAccess, branches: fullAccess, partners: fullAccess, honors: fullAccess, team: fullAccess, history: fullAccess, media: fullAccess, navigation: fullAccess, users: fullAccess, settings: fullAccess, security: fullAccess,
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: '1', username: 'admin', name: '系统管理员', roleId: 'role_admin', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop', lastLogin: '2025-01-01 09:00', mfaEnabled: false, email: 'admin@yanyun.com', phone: '138****8888'
  }
];

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  mfaEnabled: false, passwordMinLength: 8, maxLoginAttempts: 5, lockoutDurationMinutes: 15, sessionTimeoutMinutes: 30
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: '江苏盐韵工程项目管理有限公司',
  logoUrl: '', 
  graphicLogoUrl: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80&w=100&auto=format&fit=crop',
  textLogoUrl: 'https://images.unsplash.com/photo-1581094794329-cd1196532ba8?q=80&w=200&auto=format&fit=crop',
  faviconUrl: '', 
  themeColor: '#2C388B',
  contactPhone: '0515-88888888',
  contactEmail: 'office@jsyanyun.com',
  contactAddress: '江苏省盐城市盐都区世纪大道99号金融城5号楼12F',
  copyrightText: '© 2025 江苏盐韵工程项目管理有限公司 版权所有 苏ICP备12345678号',
  enableAnniversary: true, 
  anniversaryTitle: '盐韵八载 · 匠心传诚',
  anniversarySubtitle: '2017 - 2025，致力于成为最值得信赖的工程管理专家',
  anniversaryBadgeLabel: 'Established 2017'
};

export const INITIAL_SERVICES: Service[] = [
  { 
    id: '1', 
    title: '工程监理 (甲级)', 
    description: '秉承严谨执业、专业把关的原则，通过数字化巡检系统实现对施工现场质量、安全、进度及成本的实时动态监控。', 
    features: ['全过程风险识别与预控', '关键节点驻点旁站', '安全生产标准化辅导', '档案资料全数字化同步'], 
    icon: 'clipboard-check', 
    order: 1 
  },
  { 
    id: '2', 
    title: '全过程工程咨询', 
    description: '打破行业壁垒，提供从前期立项策划、招标代理到施工管理、竣工决算的“全周期、一站式”管家服务。', 
    features: ['多阶段业务深度集成', '单一责任主体高效协同', 'BIM 5D 管理技术应用', '投资收益率精细化测算'], 
    icon: 'briefcase', 
    order: 2 
  },
  { 
    id: '3', 
    title: '造价咨询与审计', 
    description: '基于大数据模型进行投资估算与成本核定，为业主提供科学的财务决策依据，实现资金使用的价值最大化。', 
    features: ['工程量清单精准编制', '中期进度款支付核定', '竣工结算全流程审计', '材料价格波动趋势分析'], 
    icon: 'calculator', 
    order: 3 
  },
  { 
    id: '4', 
    title: '招标代理', 
    description: '提供合规、公正的采购顾问服务，涵盖施工、监理、材料供应及服务类项目的全流程招采组织。', 
    features: ['定制化资格预审方案', '综合评估法模型设计', '全流程电子化交易支持', '投标合规性风险排查'], 
    icon: 'gavel', 
    order: 4 
  }
];

export const INITIAL_PROJECTS: ProjectCase[] = [
  { 
    id: '1', 
    title: '盐城大数据中心三期扩建项目', 
    category: '公共建筑', 
    description: '省重点基建工程，总投资超12亿元，采用BIM全生命周期管理，实现数字化移交。', 
    content: '<h3>项目概况</h3><p>该项目是江苏省打造“数字江苏”的核心底座，占地面积5.4万平方米。盐韵团队承担了施工全过程监理及全过程工程咨询工作。</p><h3>技术亮点</h3><p>在施工阶段，我们引入了5D动态预控技术，对机房精密管线、IDC机柜布局进行虚拟演练，有效规避了图纸冲突340余处，节约成本约4.5%。</p>', 
    imageUrl: 'https://images.unsplash.com/photo-1544102859-60fbd2654b41?q=80&w=2070&auto=format&fit=crop', 
    location: '盐城市城南新区', 
    date: '2024-06', 
    isFeatured: true 
  },
  { 
    id: '2', 
    title: '南通金融城超高层建筑群', 
    category: '综合商业', 
    description: '涵盖超五星级酒店、甲级写字楼，总建筑面积28万平方米，盐韵负责造价咨询服务。', 
    content: '<h3>项目概况</h3><p>本项目为南通市新地标建筑群。通过精细化造价管理，我们成功将静态投资控制在预算的95%以内。</p>', 
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', 
    location: '南通市崇川区', 
    date: '2023-12', 
    isFeatured: true 
  }
];

export const COMPANY_HISTORY: HistoryEvent[] = [
  { id: '1', year: '2017', title: '公司创立', description: '江苏盐韵在盐城正式启航，获得工程监理初步资质，立志于深耕本土市场。' },
  { id: '2', year: '2019', title: '资质升级', description: '获批国家房屋建筑工程监理甲级资质，业务覆盖范围延伸至全省。' },
  { id: '3', year: '2021', title: '数字化转型', description: '上线自主研发的 Yy-PMS 管理系统，全面推行数字化监理巡检作业。' },
  { id: '4', year: '2023', title: '跨区跨国协作', description: '在苏州、南通设立分公司，并参与多个国际品牌在华工业项目的代建管理。' },
  { id: '5', year: '2025', title: '八载辉煌', description: '累计服务工程总造价突破1000亿元，正式开启全过程工程咨询2.0时代。' }
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: '张伟', role: '总经理 / 国家注册监理工程师', description: '25年大型基建管理经验，曾任多家特级建安企业技术负责人。', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: '李静', role: '技术总监 / 国家注册造价工程师', description: '精通FIDIC条款，主持过超50个亿级项目的全过程造价审计。', imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' }
];

export const INITIAL_HONOR_CATEGORIES: HonorCategory[] = [
  { id: 'cat_comp', name: '企业核心资质', order: 1 },
  { id: 'cat_award', name: '行业荣誉奖项', order: 2 }
];

export const INITIAL_HONORS: Honor[] = [
  { id: '1', title: '房屋建筑工程监理甲级', issueDate: '2022-05', issuingAuthority: '住房和城乡建设部', imageUrl: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?q=80&w=300&auto=format&fit=crop', categoryId: 'cat_comp' },
  { id: '2', title: '江苏省优秀工程咨询单位', issueDate: '2024-01', issuingAuthority: '江苏省建设监理协会', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Excellence+Award', categoryId: 'cat_award' }
];

export const INITIAL_PAGE_CONTENT: PageContent = {
  topNav: [
    { id: 'nav_home', label: '首页', path: '/', isVisible: true, order: 1 },
    { id: 'nav_about', label: '关于盐韵', path: '/about', isVisible: true, order: 2 },
    { id: 'nav_services', label: '业务领域', path: '/services', isVisible: true, order: 3 },
    { id: 'nav_cases', label: '标杆案例', path: '/cases', isVisible: true, order: 4 },
    { id: 'nav_performances', label: '业绩库', path: '/performances', isVisible: true, order: 5 },
    { id: 'nav_honor', label: '荣誉资质', path: '/honors', isVisible: true, order: 6 },
    { id: 'nav_tenders', label: '招采信息', path: '/tenders', isVisible: true, order: 7 },
    { id: 'nav_news', label: '新闻动态', path: '/news', isVisible: true, order: 8 },
    { id: 'nav_branches', label: '分支机构', path: '/branches', isVisible: true, order: 9 },
  ],
  headers: {
    about: { title: '关于盐韵', subtitle: '深耕工程管理八载，致力于成为卓越的资产守护专家', backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop' },
    services: { title: '业务领域', subtitle: '全过程工程咨询服务，以数字化技术赋能传统工程管理', backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop' },
    cases: { title: '标杆案例', subtitle: '每一个精品工程，都是我们对“质量生命线”的庄严承诺', backgroundImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070&auto=format&fit=crop' },
    news: { title: '新闻动态', subtitle: '关注行业趋势，发布企业实时动态', backgroundImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop' },
    branches: { title: '分支机构', subtitle: '立足江苏，服务长三角，构建即时响应服务网络', backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop' },
    contact: { title: '联系我们', subtitle: '期待与您携手，共创精品工程', backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f142fcb93370?q=80&w=2070&auto=format&fit=crop' },
    navigation: { title: '行业导航', subtitle: '行业资源快速入口', backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop' },
    honors: { title: '荣誉资质', subtitle: '权威认证是对专业主义的最佳背书', backgroundImage: 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?q=80&w=2070&auto=format&fit=crop' },
    tenders: { title: '招采信息', subtitle: '公平、公正、公开的工程采购发布平台', backgroundImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop' },
    performances: { title: '业绩库', subtitle: '基于 Yy-PMS 的多品类工程业绩存档', backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop' }
  },
  home: {
    layout: [
      { id: 'hero', type: 'hero', label: '首屏视觉', isVisible: true, order: 1 },
      { id: 'stats', type: 'stats', label: '核心数据', isVisible: true, order: 2 },
      { id: 'process', type: 'process', label: '管理方法论', isVisible: true, order: 3 },
      { id: 'projects', type: 'projects', label: '精选案例', isVisible: true, order: 4 },
      { id: 'services', type: 'services', label: '核心业务', isVisible: true, order: 5 },
      { id: 'partners', type: 'partners', label: '合作伙伴', isVisible: true, order: 6 },
    ],
    hero: {
      badge: 'Integrated Project Management Solution',
      titleLine1: '数智赋能',
      titleHighlight: '工程全生命周期管理',
      description: '江苏盐韵致力于打造“咨询+科技+运营”三位一体的工程管理新范式，为基建、工业及公建项目提供零缺陷、全闭环的专业顾问服务。',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      buttonText: '探索服务体系',
      buttonLink: '/services',
      secondaryButtonText: '查看业绩库',
      secondaryButtonLink: '/performances'
    },
    stats: {
      stat1: { value: '8+', label: '载行业深耕' },
      stat2: { value: '500+', label: '完成项目' },
      stat3: { value: '1000亿+', label: '咨询总造价' },
      stat4: { value: '100%', label: '审计通过率' }
    },
    process: {
      title: '基于 Yy-PMS 的管理方法论',
      description: '我们将工程监理与项目管理深度集成于数字化底座，实现从“事后纠偏”向“事前预警”的范式转变。',
      steps: [
        { title: '全景策划', desc: '基于大数据进行投资测算，识别法规红线。' },
        { title: '动态管控', desc: '实时汇总现场5D数据，精准匹配投资强度。' },
        { title: '数字化移交', desc: '资产信息云端同步，无缝衔接后期运维。' }
      ]
    },
    cta: {
      title: '准备好开始您的项目了吗？',
      description: '无论是全过程工程咨询还是专项代建管理，盐韵团队随时待命。',
      buttonText: '预约专家访谈',
      buttonLink: '/contact'
    }
  },
  about: {
    intro: {
      title: '不仅仅是监理，更是您的资产管家',
      content1: '江苏盐韵工程项目管理有限公司成立于2017年，是江苏省内成长速度最快的综合型工程咨询服务商之一。公司目前拥有房屋建筑工程监理甲级、市政公用工程监理甲级等多项目核心资质。',
      content2: '我们坚持通过数字化技术手段与严谨的合规流程，为业主的每一分投资护航。',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop'
    },
    culture: { mission: '为客户创造价值', values: '诚信、专业、创新', management: '基于数据的客观决策' }
  },
  services: {
    introStats: [
      { icon: 'Shield', label: '资质保障', desc: '双甲级监理资质' },
      { icon: 'Clock', label: '高效响应', desc: '4小时现场部署' },
      { icon: 'TrendingUp', label: '降本增效', desc: '平均节约投资5.2%' },
      { icon: 'Users', label: '专家库', desc: '注师领衔团队' }
    ],
    faqs: [
      { q: '全过程工程咨询能为业主带来什么核心价值？', a: '相较于传统的碎片化外包，全过程咨询能消除信息孤岛，通过单一责任主体实现从立项到结算的闭环管控，通常能缩短工期10-15%，降低成本5-8%。' }
    ]
  },
  footer: {
    quickLinks: [
      { id: '1', name: '品牌故事', path: '/about', isVisible: true },
      { id: '2', name: '核心业务', path: '/services', isVisible: true },
      { id: '3', name: '经典案例', path: '/cases', isVisible: true },
      { id: '4', name: '招贤纳士', path: '/careers', isVisible: true },
    ],
    showContactInfo: true,
    showCopyright: true
  }
};

export const INITIAL_NEWS: NewsItem[] = [
  { id: '1', title: '盐韵参与编制的《江苏省智慧工地管理标准》正式发布', summary: '作为行业领先的数智化管理专家，盐韵受邀参与本次标准起草，标志着公司技术实力获得官方认可。', content: '<p>近日...</p>', date: '2025-01-20', category: '公司新闻', published: true, imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop' }
];

export const INITIAL_BRANCH_CATEGORIES: BranchCategory[] = [{ id: 'cat_hq', name: '总部及研发中心', order: 0 }];
export const INITIAL_BRANCHES: Branch[] = [{ id: '1', name: '盐韵盐城总部', address: '盐城市金融城5号楼12F', phone: '0515-88888888', manager: '张总经理', coordinates: { lat: 33.347, lng: 120.163 }, categoryId: 'cat_hq' }];
export const INITIAL_LINKS: NavigationLink[] = [{ id: '1', title: '江苏省智慧工地云平台', url: 'https://zhgd.js.gov.cn/', category: '政府监管' }];
export const INITIAL_PARTNERS: Partner[] = [{ id: '1', name: '中南集团', logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200&auto=format&fit=crop' }];
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
export const INITIAL_TENDERS: TenderItem[] = [];
export const INITIAL_PERFORMANCES: PerformanceItem[] = [];
export const INITIAL_MEDIA: MediaItem[] = [];
