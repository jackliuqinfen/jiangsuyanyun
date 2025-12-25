
import { Branch, BranchCategory, HistoryEvent, Honor, HonorCategory, NavigationLink, NewsItem, Partner, ProjectCase, Role, Service, SiteSettings, TeamMember, Testimonial, User, ResourceType, MediaItem, PageContent, TenderItem, SecurityConfig, FooterLink, HomeSectionConfig, PageHeaderConfig, PerformanceItem } from './types';

// Helper to create full permissions
const fullAccess = { read: true, write: true, delete: true };
const readOnly = { read: true, write: false, delete: false };
const noAccess = { read: false, write: false, delete: false };

export const RESOURCES: {id: ResourceType, label: string}[] = [
  { id: 'pages', label: '页面内容' },
  { id: 'news', label: '新闻动态' },
  { id: 'tenders', label: '招标信息' },
  { id: 'performances', label: '企业业绩' }, // Added
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
      pages: fullAccess,
      news: fullAccess,
      tenders: fullAccess,
      performances: fullAccess, // Added
      projects: fullAccess,
      services: fullAccess,
      branches: fullAccess,
      partners: fullAccess,
      honors: fullAccess,
      team: fullAccess,
      history: fullAccess,
      media: fullAccess,
      navigation: fullAccess,
      users: fullAccess,
      settings: fullAccess,
      security: fullAccess,
    }
  },
  {
    id: 'role_editor',
    name: '内容编辑',
    description: '可以管理除系统设置和用户以外的所有内容',
    isSystem: false,
    permissions: {
      pages: fullAccess,
      news: fullAccess,
      tenders: fullAccess,
      performances: fullAccess, // Added
      projects: fullAccess,
      services: fullAccess,
      branches: fullAccess,
      partners: fullAccess,
      honors: fullAccess,
      team: fullAccess,
      history: fullAccess,
      media: fullAccess,
      navigation: fullAccess,
      users: noAccess,
      settings: noAccess,
      security: noAccess,
    }
  },
  {
    id: 'role_viewer',
    name: '访客/只读',
    description: '只能查看后台数据，无法修改',
    isSystem: false,
    permissions: {
      pages: readOnly,
      news: readOnly,
      tenders: readOnly,
      performances: readOnly, // Added
      projects: readOnly,
      services: readOnly,
      branches: readOnly,
      partners: readOnly,
      honors: readOnly,
      team: readOnly,
      history: readOnly,
      media: readOnly,
      navigation: readOnly,
      users: noAccess,
      settings: noAccess,
      security: noAccess,
    }
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    name: '系统管理员',
    roleId: 'role_admin',
    avatar: '/images/team/admin.jpg',
    lastLogin: '2023-12-01 09:00',
    mfaEnabled: false,
    email: 'admin@yanyun.com',
    phone: '138****8888'
  }
];

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  mfaEnabled: false,
  passwordMinLength: 8,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  sessionTimeoutMinutes: 30
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: '江苏盐韵工程项目管理有限公司',
  logoUrl: '', 
  graphicLogoUrl: '/images/logo.png',
  textLogoUrl: '/images/logo-text.png',
  faviconUrl: '/favicon.ico', 
  themeColor: '#2C388B',
  contactPhone: '0515-88888888',
  contactEmail: 'office@jsyanyun.com',
  contactAddress: '江苏省盐城市盐都区世纪大道99号金融城5号楼12F',
  copyrightText: '© 2025 江苏盐韵工程项目管理有限公司 版权所有 苏ICP备12345678号',
  enableAnniversary: true, 
  anniversaryTitle: '盐韵八载 · 匠心传诚',
  anniversarySubtitle: '感恩一路同行，共鉴品质工程',
  anniversaryBadgeLabel: 'Est. 2017'
};

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: '1',
    name: 'Office Exterior',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    type: 'image',
    category: 'site',
    uploadDate: '2023-01-01',
    size: '1.2 MB'
  }
];

export const INITIAL_TENDERS: TenderItem[] = [
  {
    id: '1',
    title: '盐城市2024年度市政道路改造工程施工招标',
    projectNo: 'YC-2024-SZ001',
    category: '招标公告',
    region: '盐城市亭湖区',
    date: '2024-03-10',
    deadline: '2024-03-30',
    status: '报名中',
    content: '<h3>招标条件</h3><p>本招标项目盐城市2024年度市政道路改造工程已由盐城市发展和改革委员会批准建设...</p>'
  },
  {
    id: '2',
    title: '滨海县人民医院新院区医疗设备采购项目中标结果公示',
    projectNo: 'BH-2024-CG015',
    category: '中标公告',
    region: '盐城市滨海县',
    date: '2024-03-05',
    deadline: undefined,
    status: '公示中',
    content: '<h3>中标结果</h3><p>中标单位：江苏XX医疗器械有限公司...</p>'
  },
  {
    id: '3',
    title: '关于推迟大丰港物流园二期工程开标时间的通知',
    projectNo: 'DF-2024-GC008',
    category: '其他公告',
    region: '盐城市大丰区',
    date: '2024-03-08',
    deadline: undefined,
    status: '进行中',
    content: '<p>各投标人：</p><p>因招标文件技术参数调整，现决定推迟原定于...</p>'
  }
];

// Initial Performance Data
export const INITIAL_PERFORMANCES: PerformanceItem[] = [
  {
    id: '1',
    title: '盐城市快速路网三期工程招标代理',
    category: '招标代理',
    client: '盐城市市政公用投资有限公司',
    amount: '35.8 亿元',
    date: '2023-05-20',
    content: '<p>本项目为盐城市重点交通基础设施工程，我司负责全过程招标代理服务，包括施工、监理、检测等多个标段。</p>',
    isPublished: true
  },
  {
    id: '2',
    title: '江苏省沿海开发集团办公大楼装修工程监理',
    category: '监理服务',
    client: '江苏省沿海开发集团',
    amount: '1.2 亿元',
    date: '2023-08-15',
    content: '<p>对办公大楼内部精装修、智能化系统及消防工程进行全过程监理。</p>',
    isPublished: true
  },
  {
    id: '3',
    title: '亭湖区2023年度老旧小区改造项目全过程跟踪审计',
    category: '造价咨询',
    client: '亭湖区住房和城乡建设局',
    amount: '4.5 亿元',
    date: '2023-03-10',
    content: '<p>提供从预算编制、进度款审核到竣工结算的全过程造价控制服务。</p>',
    isPublished: true
  },
  {
    id: '4',
    title: '大丰港经济开发区产业规划咨询',
    category: '其他咨询服务',
    client: '大丰港经济开发区管委会',
    amount: '-',
    date: '2023-11-01',
    content: '<p>为开发区未来5年的产业布局提供可行性研究及战略咨询。</p>',
    isPublished: true
  },
  {
    id: '5',
    title: '射阳县人民医院新院区医疗设备采购招标',
    category: '招标代理',
    client: '射阳县人民医院',
    amount: '8000 万元',
    date: '2024-01-15',
    content: '<p>包含核磁共振、CT等大型医疗设备的国际招标代理。</p>',
    isPublished: true
  }
];

export const INITIAL_PAGE_CONTENT: PageContent = {
  headers: {
    about: { title: '品牌溯源', subtitle: '深耕工程管理八载，致力于成为卓越的资产全生命周期守护者', backgroundImage: '/images/banners/about.jpg' },
    services: { title: '核心业务', subtitle: '全过程工程咨询服务，以数字化技术赋能传统工程管理模式', backgroundImage: '/images/banners/services.jpg' },
    cases: { title: '经典案例', subtitle: '每一个精品工程，都是我们对“质量生命线”的庄严承诺', backgroundImage: '/images/banners/cases.jpg' },
    news: { title: '行业动态', subtitle: '把握行业脉搏，传递盐韵声音', backgroundImage: '/images/banners/news.jpg' },
    branches: { title: '服务网络', subtitle: '立足江苏，辐射长三角，构建全方位的即时响应体系', backgroundImage: '/images/banners/branches.jpg' },
    contact: { title: '联系我们', subtitle: '期待与您携手，共创价值。咨询热线：0515-88888888', backgroundImage: '/images/banners/contact.jpg' },
    navigation: { title: '行业导航', subtitle: '为您整合行业政策及招投标入口', backgroundImage: '/images/banners/nav.jpg' },
    honors: { title: '资质荣誉', subtitle: '权威认证是对专业主义的最佳背书', backgroundImage: '/images/banners/honors.jpg' },
    tenders: { title: '招采频道', subtitle: '发布项目实时招标与中标讯息', backgroundImage: '/images/banners/tenders.jpg' },
    performances: { title: '企业业绩', subtitle: '用数据说话，见证每一次交付的承诺', backgroundImage: '/images/banners/performances.jpg' } // Added
  },
  home: {
    layout: [
      { id: 'hero', type: 'hero', label: '首屏视觉', isVisible: true, order: 1 },
      { id: 'stats', type: 'stats', label: '核心成就', isVisible: true, order: 2 },
      { id: 'process', type: 'process', label: '管理方法论', isVisible: true, order: 3 },
      { id: 'projects', type: 'projects', label: '精选案例', isVisible: true, order: 4 },
      { id: 'services', type: 'services', label: '核心业务', isVisible: true, order: 5 },
      { id: 'honors', type: 'honors', label: '荣誉资质', isVisible: true, order: 6 },
      { id: 'partners', type: 'partners', label: '合作伙伴', isVisible: true, order: 7 },
    ],
    hero: {
      badge: 'Smart Construction Management Expert',
      titleLine1: '数智化赋能',
      titleHighlight: '工程全生命周期管理',
      description: '江苏盐韵致力于打造“咨询+科技+运营”三位一体的工程管理新范式，为基建项目提供全闭环顾问服务。',
      bgImage: '/images/hero/main-bg.jpg',
      buttonText: '探索服务体系',
      buttonLink: '/services',
      secondaryButtonText: '查看业绩库',
      secondaryButtonLink: '/cases'
    },
    stats: {
      stat1: { value: '8+', label: '载行业深耕' },
      stat2: { value: '500+', label: '标杆项目沉淀' },
      stat3: { value: '1000亿+', label: '咨询造价总额' },
      stat4: { value: '100%', label: '审计通过率' }
    },
    process: {
      title: '基于 Yy-PMS 的管理方法论',
      description: '我们将传统的工程监理、造价控制与现代数字化技术深度融合，实现从“事后纠偏”向“事前预警”的范式转变。',
      steps: [
        { title: '全景策划', desc: '基于大数据进行投资测算，识别法规红线。' },
        { title: '动态管控', desc: '应用现场 5D 实时监控，实现成本与进度的毫米级对齐。' },
        { title: '数字化移交', desc: '全套数字资产云端交付，无缝衔接后期运营。' }
      ]
    },
    cta: {
      title: '正在寻找专业的工程管理顾问？',
      description: '无论是全过程工程咨询还是专项代建管理，盐韵团队随时待命。',
      buttonText: '预约专家访谈',
      buttonLink: '/contact'
    }
  },
  about: {
    intro: {
      title: '不仅仅是监理，更是您的资产管家',
      content1: '江苏盐韵工程项目管理有限公司成立于2017年，是江苏省内成长速度最快的综合型工程咨询服务商之一。',
      content2: '我们不满足于传统的“三控三管一协调”，更在全行业率先推广“数智化工地”模型，为业主的每一分投资护航。',
      imageUrl: '/images/about/office.jpg'
    },
    culture: { mission: '为客户创造价值', values: '诚信、专业、创新', management: '基于客观数据的精准决策' }
  },
  services: {
    introStats: [
      { icon: 'Shield', label: '双甲级资质', desc: '国家级监理标准' },
      { icon: 'Clock', label: '4小时响应', desc: '全省即时部署' },
      { icon: 'TrendingUp', label: '降本增效', desc: '优化投资约5.2%' },
      { icon: 'Users', label: '专家智库', desc: '注师领衔团队' }
    ],
    faqs: [
      { q: '全过程工程咨询能为业主带来什么核心价值？', a: '消除信息孤岛，通过单一责任主体实现从立项到结算的闭环管控，通常能缩短工期10-15%，降低成本5-8%。' }
    ]
  },
  footer: {
    quickLinks: [
      { id: '1', name: '品牌故事', path: '/about', isVisible: true },
      { id: '2', name: '核心业务', path: '/services', isVisible: true },
      { id: '3', name: '经典案例', path: '/cases', isVisible: true },
      { id: '4', name: '招才纳士', path: '/careers', isVisible: true },
    ],
    showContactInfo: true,
    showCopyright: true
  }
};

export const INITIAL_NEWS: NewsItem[] = [
  { id: '1', title: '盐韵参与编制的《江苏省智慧工地管理标准》正式发布', summary: '作为行业领先的数智化管理专家，标志着公司技术实力获得官方认可。', content: '<p>近日...</p>', date: '2025-01-20', category: '公司新闻', published: true, imageUrl: '/images/news/news-1.jpg' }
];

export const INITIAL_BRANCH_CATEGORIES: BranchCategory[] = [{ id: 'cat_hq', name: '总部及研发中心', order: 0 }];
export const INITIAL_BRANCHES: Branch[] = [{ id: '1', name: '盐韵总部', address: '盐城市金融城5号楼12F', phone: '0515-88888888', manager: '张总经理', coordinates: { lat: 33.347, lng: 120.163 }, categoryId: 'cat_hq' }];
export const INITIAL_LINKS: NavigationLink[] = [{ id: '1', title: '江苏省智慧工地云平台', url: 'https://zhgd.js.gov.cn/', category: '政府监管' }];
export const INITIAL_PARTNERS: Partner[] = [{ id: '1', name: '中南集团', logoUrl: '/images/partners/zhongnan.png' }];
export const INITIAL_TESTIMONIALS: Testimonial[] = [];
export const INITIAL_HONOR_CATEGORIES: HonorCategory[] = [{ id: 'cat_comp', name: '核心资质', order: 1 }, { id: 'cat_award', name: '行业荣誉', order: 2 }];

export const INITIAL_HONORS: Honor[] = [
  { 
    id: '1', 
    title: '房屋建筑工程监理甲级资质', 
    issueDate: '2019-05', 
    issuingAuthority: '中华人民共和国住房和城乡建设部', 
    imageUrl: '/images/honors/cert-1.jpg', 
    categoryId: 'cat_comp' 
  },
  {
    id: '2',
    title: '市政公用工程监理甲级资质',
    issueDate: '2020-08',
    issuingAuthority: '中华人民共和国住房和城乡建设部',
    imageUrl: '/images/honors/cert-2.jpg',
    categoryId: 'cat_comp'
  },
  {
    id: '3',
    title: '人防工程监理乙级资质',
    issueDate: '2021-03',
    issuingAuthority: '江苏省民防局',
    imageUrl: '/images/honors/cert-3.jpg',
    categoryId: 'cat_comp'
  },
  {
    id: '4',
    title: '江苏省优秀工程监理企业',
    issueDate: '2023-12',
    issuingAuthority: '江苏省建设监理协会',
    imageUrl: '/images/honors/award-1.jpg',
    categoryId: 'cat_award'
  },
  {
    id: '5',
    title: 'AAA级信用企业证书',
    issueDate: '2024-01',
    issuingAuthority: '中国企业信用等级评价中心',
    imageUrl: '/images/honors/cert-4.jpg',
    categoryId: 'cat_comp'
  },
  {
    id: '6',
    title: 'ISO9001 质量管理体系认证',
    issueDate: '2022-06',
    issuingAuthority: '中国质量认证中心',
    imageUrl: '/images/honors/cert-5.jpg',
    categoryId: 'cat_comp'
  },
  {
    id: '7',
    title: '盐城市“扬子杯”优质工程奖',
    issueDate: '2022-11',
    issuingAuthority: '江苏省住房和城乡建设厅',
    imageUrl: '/images/honors/award-2.jpg',
    categoryId: 'cat_award'
  }
];

export const INITIAL_SERVICES: Service[] = [
  { 
    id: '1', 
    title: '工程监理 (房屋建筑/市政双甲级)', 
    description: '通过智能化巡检系统，实现对施工现场“质量、安全、进度、投资”的四位一体动态监控。', 
    features: ['全过程风险识别与预控', '关键部位24小时驻点旁站', '安全生产标准化辅导', '档案资料数智化同步归档'], 
    icon: 'clipboard-check', 
    order: 1 
  },
  { 
    id: '2', 
    title: '全过程工程咨询 (PMC模式)', 
    description: '打破行业壁垒，提供从策划、代建、设计管理到运营维护的全周期“管家式”服务。', 
    features: ['多阶段业务流深度集成', '单一责任主体高效协同', 'BIM 5D 管理技术应用', '数字化资产完整移交'], 
    icon: 'briefcase', 
    order: 2 
  },
  { 
    id: '3', 
    title: '造价咨询与全过程审计', 
    description: '基于大数据进行投资测算与成本核定，实现项目价值最大化及建设合规性把关。', 
    features: ['工程量清单精准编制', '中期进度款支付动态核定', '竣工结算全流程审计', '材料价格趋势深度分析'], 
    icon: 'calculator', 
    order: 3 
  }
];

export const INITIAL_PROJECTS: ProjectCase[] = [
  { 
    id: '1', 
    title: '盐城大数据中心三期扩建项目', 
    category: '公共建筑', 
    description: '省重点基建工程，总投资超15亿元，应用 BIM+IoT 技术实现数智化移交。', 
    imageUrl: '/images/projects/data-center.jpg', 
    location: '盐城市城南新区', 
    date: '2024-12', 
    isFeatured: true 
  },
  { 
    id: '2', 
    title: '南通金融城超高层综合体监理', 
    category: '综合商业', 
    description: '200米级超高层建筑，包含复杂钢结构及深基坑作业，盐韵负责全过程监理。', 
    imageUrl: '/images/projects/finance-city.jpg', 
    location: '南通市崇川区', 
    date: '2023-11', 
    isFeatured: true 
  },
  {
    id: '3',
    title: '悦达起亚三工厂智能车间改造',
    category: '工业厂房',
    description: '涉及高精度设备基础施工与钢结构大跨度吊装，工期紧任务重。',
    imageUrl: '/images/projects/kia-factory.jpg',
    location: '盐城经济开发区',
    date: '2023-08',
    isFeatured: true
  },
  {
    id: '4',
    title: '盐城高铁站综合交通枢纽',
    category: '基础设施',
    description: '集高铁、长途客运、公交、出租于一体的城市交通核心，获鲁班奖提名。',
    imageUrl: '/images/projects/railway-station.jpg',
    location: '盐城市亭湖区',
    date: '2022-05',
    isFeatured: true
  },
  {
    id: '5',
    title: '中韩(盐城)产业园未来科技城',
    category: '公共建筑',
    description: '园区地标性建筑群，包含研发中心、展示中心及人才公寓，采用绿色建筑三星标准。',
    imageUrl: '/images/projects/tech-city.jpg',
    location: '盐城河东新区',
    date: '2023-01',
    isFeatured: true
  },
  {
    id: '6',
    title: '大丰港深水航道整治工程',
    category: '基础设施',
    description: '省重点水运工程，监理团队克服海上作业恶劣环境，确保工程按期完工。',
    imageUrl: '/images/projects/dafeng-port.jpg',
    location: '盐城市大丰区',
    date: '2021-12',
    isFeatured: true
  },
  {
    id: '7',
    title: '射阳县人民医院异地新建项目',
    category: '公共建筑',
    description: '三级甲等综合医院标准建设，包含门诊楼、住院楼及感染楼，总建筑面积18万平米。',
    imageUrl: '/images/projects/sheyang-hospital.jpg',
    location: '盐城市射阳县',
    date: '2024-02',
    isFeatured: true
  }
];

export const COMPANY_HISTORY: HistoryEvent[] = [
  { id: '1', year: '2017', title: '品牌创立', description: '江苏盐韵在盐城金融城正式启航，确立“以专业求生存”的发展理念。' },
  { id: '2', year: '2019', title: '资质跨越', description: '成功获批国家房屋建筑工程监理甲级资质，开启全省化布局。' },
  { id: '3', year: '2021', title: '数智转型', description: '全面上线 Yy-PMS 智慧工程管理系统，实现监理作业数字化、云端化。' },
  { id: '4', year: '2025', title: '八载辉煌', description: '累计咨询项目总造价突破1000亿元，正式迈入全过程工程咨询2.0时代。' }
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: '张伟', role: '总经理 / 国家注册监理工程师', description: '25年基建管理经验，曾主导多项省优、部优工程项目。', imageUrl: '/images/team/member-1.jpg' },
  { id: '2', name: '李静', role: '技术总监 / 国家注册造价工程师', description: '精通全过程造价管控，主持过超过50个大型项目的预决算审计。', imageUrl: '/images/team/member-2.jpg' }
];
