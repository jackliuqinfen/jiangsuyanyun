
import { Branch, BranchCategory, HistoryEvent, Honor, HonorCategory, NavigationLink, NewsItem, Partner, ProjectCase, Role, Service, SiteSettings, TeamMember, Testimonial, User, ResourceType, MediaItem, PageContent, TenderItem, SecurityConfig, FooterLink, HomeSectionConfig, PageHeaderConfig } from './types';

// Helper to create full permissions
const fullAccess = { read: true, write: true, delete: true };
const readOnly = { read: true, write: false, delete: false };
const noAccess = { read: false, write: false, delete: false };

export const RESOURCES: {id: ResourceType, label: string}[] = [
  { id: 'pages', label: '页面内容' },
  { id: 'news', label: '新闻动态' },
  { id: 'tenders', label: '招标信息' },
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
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
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
  siteName: '江苏盐韵工程项目管理',
  logoUrl: '', // unused in new design but kept for type compatibility
  graphicLogoUrl: 'https://placehold.co/100x100/2C388B/ffffff?text=Y',
  textLogoUrl: 'https://placehold.co/200x50/transparent/2C388B?text=YANYUN',
  faviconUrl: '', // Default favicon placeholder
  themeColor: '#2C388B',
  contactPhone: '0515-88888888',
  contactEmail: 'contact@yanyun.com',
  contactAddress: '江苏省盐城市盐都区世纪大道99号金融城',
  copyrightText: '© 2025 Jiangsu Yanyun Project Management Co., Ltd. All rights reserved.',
  enableAnniversary: true, // Default to true for celebration
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

export const INITIAL_PAGE_CONTENT: PageContent = {
  headers: {
    about: {
      title: '关于盐韵',
      subtitle: '深耕工程管理二十载，铸就行业标杆',
      backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    services: {
      title: '业务领域',
      subtitle: '全过程、全方位的工程咨询服务体系',
      backgroundImage: 'https://images.unsplash.com/photo-1581094794329-cd1196532ba8?q=80&w=2070&auto=format&fit=crop'
    },
    cases: {
      title: '经典案例',
      subtitle: '见证城市生长，镌刻品质印记',
      backgroundImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop'
    },
    news: {
      title: '新闻动态',
      subtitle: '关注行业动态，发布企业资讯',
      backgroundImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop'
    },
    branches: {
      title: '分支机构',
      subtitle: '立足盐城，服务全省',
      backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
    },
    contact: {
      title: '联系我们',
      subtitle: '期待与您携手共创美好未来',
      backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f142fcb93370?q=80&w=2074&auto=format&fit=crop'
    },
    navigation: {
      title: '网址导航',
      subtitle: '行业资源快速入口',
      backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop'
    },
    honors: {
      title: '荣誉资质',
      subtitle: '实力见证，载誉前行',
      backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop'
    },
    tenders: {
      title: '招标信息',
      subtitle: '公开、公平、公正的信息发布平台',
      backgroundImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop'
    }
  },
  footer: {
    quickLinks: [
      { id: '1', name: '关于我们', path: '/about', isVisible: true },
      { id: '2', name: '服务体系', path: '/services', isVisible: true },
      { id: '3', name: '项目案例', path: '/cases', isVisible: true },
      { id: '4', name: '新闻动态', path: '/news', isVisible: true },
      { id: '5', name: '招才纳士', path: '/careers', isVisible: true },
      { id: '6', name: '联系方式', path: '/contact', isVisible: true },
    ],
    showContactInfo: true,
    showCopyright: true
  },
  home: {
    layout: [
      { id: 'hero', type: 'hero', label: '首屏 Hero', isVisible: true, order: 1 },
      { id: 'stats', type: 'stats', label: '数据统计', isVisible: false, order: 2 },
      { id: 'services', type: 'services', label: '核心服务', isVisible: true, order: 3 },
      { id: 'process', type: 'process', label: '管理流程', isVisible: true, order: 4 },
      { id: 'projects', type: 'projects', label: '精选案例', isVisible: true, order: 5 },
      { id: 'honors', type: 'honors', label: '荣誉展示', isVisible: true, order: 6 },
      { id: 'partners', type: 'partners', label: '合作伙伴', isVisible: true, order: 7 },
      { id: 'cta', type: 'cta', label: '行动号召', isVisible: false, order: 8 },
    ],
    hero: {
      badge: 'Smart Construction Management',
      titleLine1: '工程全生命周期',
      titleHighlight: '数智化管理专家',
      description: '江苏盐韵工程项目管理有限公司，致力于为客户提供从项目策划、工程监理到造价咨询的一站式专业服务。以技术赋能管理，以匠心铸就品质。',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      buttonText: '探索我们的服务',
      buttonLink: '/services',
      secondaryButtonText: '查看成功案例',
      secondaryButtonLink: '/cases'
    },
    stats: {
      stat1: { value: '20+', label: '年行业经验' },
      stat2: { value: '500+', label: '完成项目' },
      stat3: { value: '100%', label: '竣工验收合格率' },
      stat4: { value: '50+', label: '专业技术人才' }
    },
    process: {
      title: '全过程数字化管控系统 (Yy-PMS)',
      description: '我们将工程监理与项目管理深度集成于数字化底座，实现从“事后纠偏”向“事前预警”的范式转变。',
      steps: [
        { title: '数据驱动', desc: '实时汇总现场5D数据，精准匹配投资强度。' },
        { title: '智能合规', desc: '全自动化风险扫描，规避法律及施工红线。' },
        { title: '云端交付', desc: '工程文档全数字化存档，支持全周期可追溯查询。' }
      ]
    },
    cta: {
      title: '准备好开始您的项目了吗？',
      description: '立即联系我们，获取专业的工程咨询方案。',
      buttonText: '联系我们',
      buttonLink: '/contact'
    }
  },
  about: {
    intro: {
      title: '深耕工程管理二十载',
      content1: '江苏盐韵工程项目管理有限公司成立于2010年，是一家集工程监理、项目管理、造价咨询、招标代理于一体的综合性工程咨询企业。公司拥有房屋建筑工程监理甲级、市政公用工程监理甲级等多项资质。',
      content2: '多年来，我们始终坚持“科学管理、优质服务、廉洁公正、不仅让业主满意”的质量方针，参与了众多省市重点工程建设，赢得了广泛的社会赞誉。',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop'
    },
    culture: {
      mission: '为客户创造价值，为员工搭建平台，为社会贡献精品。',
      values: '诚信、专业、创新、共赢。',
      management: '以人为本，制度先行；目标导向，结果负责。'
    }
  },
  services: {
    introStats: [
      { icon: 'Shield', label: '资质保障', desc: '甲级监理资质' },
      { icon: 'Clock', label: '高效服务', desc: '24h 响应机制' },
      { icon: 'TrendingUp', label: '成本控制', desc: '精准造价审核' },
      { icon: 'Users', label: '专业团队', desc: '注师领衔' }
    ],
    faqs: [
      { q: '你们主要承接哪些类型的项目？', a: '我们主要承接房屋建筑工程（住宅、商业、办公、公建等）和市政公用工程（道路、桥梁、管网等）的监理及全过程咨询服务。' },
      { q: '项目收费标准是怎样的？', a: '我们的收费严格参照国家及江苏省相关服务收费标准，并根据项目的具体规模、复杂程度及服务周期与业主协商确定，确保性价比。' },
      { q: '如何保证监理人员的到岗履职？', a: '我们拥有完善的考勤及巡查制度，采用数字化管理平台（钉钉/智慧工地）进行实时打卡和轨迹追踪，确保人员按合同要求在岗履职。' }
    ]
  }
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: '江苏盐韵荣获“省优秀工程管理企业”称号',
    summary: '在近日召开的江苏省建筑行业年度大会上，我司凭借优异的项目管理业绩荣获表彰。',
    content: '<h3>荣誉背后的故事</h3><p>近日，在江苏省建筑行业协会主办的年度表彰大会上，我司凭借在多个重点工程中的卓越表现，荣获“江苏省优秀工程管理企业”称号。这不仅是对我们过去一年工作的肯定，更是对未来发展的鞭策。</p><p>公司总经理张伟在接受采访时表示：“这份荣誉属于每一位盐韵人。我们将继续秉持‘匠心筑梦，品质先行’的理念，为客户提供更优质的服务。”</p>',
    date: '2023-10-15',
    category: '公司新闻',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1932&auto=format&fit=crop'
  },
  {
    id: '2',
    title: '盐城滨海新区重点项目顺利竣工验收',
    summary: '由我司负责监理的滨海新区商业综合体项目今日顺利通过竣工验收。',
    content: '<p>热烈庆祝盐城滨海新区重点商业综合体项目顺利通过竣工验收！该项目总建筑面积达12万平方米，是滨海新区未来的地标性建筑。</p><p>在项目建设过程中，我司监理团队克服了工期紧、任务重、技术复杂等多重困难，严格把控质量关、安全关，确保了项目的高品质交付。</p>',
    date: '2023-11-02',
    category: '项目动态',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: '关于加强冬季施工安全管理的通知',
    summary: '为确保冬季施工安全，公司技术部下发最新安全管理规范。',
    content: '<p>各项目部：</p><p>随着气温逐渐降低，冬季施工安全风险增加。为切实做好冬季施工安全生产工作，现将有关事项通知如下：</p><ul><li>加强防冻、防滑措施检查。</li><li>严格规范用电、用火管理。</li><li>加强对施工人员的安全教育培训。</li></ul>',
    date: '2023-11-10',
    category: '通知公告',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '4',
    title: '数字化转型：引入BIM技术提升管理效能',
    summary: '公司全面推进数字化转型战略，在多个在建项目中深度应用BIM技术。',
    content: '...',
    date: '2023-12-05',
    category: '公司新闻',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-cd1196532ba8?q=80&w=2070&auto=format&fit=crop'
  }
];

export const INITIAL_PROJECTS: ProjectCase[] = [
  {
    id: '1',
    title: '盐城市政务中心扩建工程',
    category: '市政工程',
    description: '总建筑面积5万平方米，包括主体办公楼及配套设施。',
    content: '<h3>项目概况</h3><p>盐城市政务中心扩建工程是市重点民生工程，旨在提升政务服务效率和市民办事体验。项目总投资约3.5亿元，主要建设内容包括政务大厅、后台办公区、会议中心及地下车库等。</p><h3>技术难点</h3><p>该项目涉及深基坑支护、大跨度钢结构安装等技术难题。我司项目管理团队通过引入BIM技术进行全过程模拟，有效解决了管线碰撞、施工工序衔接等问题。</p><h3>成果展示</h3><p>项目提前2个月竣工交付，并荣获江苏省“扬子杯”优质工程奖。</p>',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    location: '盐城市',
    date: '2022-05',
    isFeatured: true
  },
  {
    id: '2',
    title: '高新区智慧产业园一期',
    category: '工业厂房',
    description: '现代化标准厂房及研发中心，采用多项绿色建筑技术。',
    content: '<p>高新区智慧产业园一期项目占地200亩，总建筑面积15万平方米。项目定位为高端智能制造产业基地，集研发、生产、办公于一体。</p>',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop',
    location: '盐城高新区',
    date: '2023-01',
    isFeatured: true
  },
  {
    id: '3',
    title: '幸福家园安置房小区',
    category: '住宅工程',
    description: '大型民生工程，包含20栋高层住宅及社区服务中心。',
    content: '<p>幸福家园安置房项目是建湖县重点民生实事工程，旨在改善居民居住条件。项目包含20栋高层住宅、幼儿园、社区服务中心及商业配套设施。</p>',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070&auto=format&fit=crop',
    location: '建湖县',
    date: '2022-11',
    isFeatured: false
  },
  {
    id: '4',
    title: '滨海港口物流中心',
    category: '基础设施',
    description: '提升港口吞吐能力的关键物流枢纽工程。',
    content: '<p>详细的项目介绍内容待补充...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    location: '滨海县',
    date: '2023-03',
    isFeatured: true
  },
  {
    id: '5',
    title: '东台市科技文化馆',
    category: '公共建筑',
    description: '集科技展览、文化交流于一体的城市新地标，获鲁班奖提名。',
    content: '<p>详细的项目介绍内容待补充...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    location: '东台市',
    date: '2023-06',
    isFeatured: true
  },
  {
    id: '6',
    title: '射阳风电产业基地',
    category: '工业厂房',
    description: '新能源产业配套设施，高标准钢结构厂房建设。',
    content: '<p>详细的项目介绍内容待补充...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=2070&auto=format&fit=crop',
    location: '射阳县',
    date: '2023-09',
    isFeatured: true
  },
  {
    id: '7',
    title: '大丰区全域旅游集散中心',
    category: '公共建筑',
    description: '提升区域旅游服务接待能力的重点项目，采用钢结构大跨度设计。',
    content: '<p>详细的项目介绍内容待补充...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?q=80&w=2000&auto=format&fit=crop',
    location: '大丰区',
    date: '2023-11',
    isFeatured: true
  },
  {
    id: '8',
    title: '响水县人民医院新院区',
    category: '公共建筑',
    description: '集医疗、教学、科研、预防保健为一体的三级综合医院建设项目。',
    content: '<p>详细的项目介绍内容待补充...</p>',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b9af955?q=80&w=2000&auto=format&fit=crop',
    location: '响水县',
    date: '2024-01',
    isFeatured: true
  }
];

export const INITIAL_SERVICES: Service[] = [
  { 
    id: '1', 
    title: '工程监理', 
    description: '提供全过程、全方位的工程监理服务，确保工程质量、进度和安全。', 
    features: ['施工阶段质量控制', '进度计划审核', '安全生产监督', '工程款支付审核'],
    icon: 'clipboard-check', 
    order: 1 
  },
  { 
    id: '2', 
    title: '项目管理', 
    description: '代建制项目管理，从前期策划到竣工交付的一站式服务。', 
    features: ['项目前期策划', '报批报建代理', '设计管理', '合同管理'],
    icon: 'briefcase', 
    order: 2 
  },
  { 
    id: '3', 
    title: '造价咨询', 
    description: '精准的工程造价预算、结算审核及全过程造价控制。', 
    features: ['投资估算编制', '工程量清单编制', '全过程造价跟踪', '竣工结算审核'],
    icon: 'calculator', 
    order: 3 
  },
  { 
    id: '4', 
    title: '招标代理', 
    description: '专业的工程招标代理及政府采购代理服务。', 
    features: ['招标方案策划', '招标文件编制', '开评标组织', '合同谈判协助'],
    icon: 'gavel', 
    order: 4 
  },
];

export const INITIAL_BRANCH_CATEGORIES: BranchCategory[] = [
  { id: 'cat_hq', name: '集团总部', order: 0 },
  { id: 'cat_yc', name: '盐城市', order: 1 },
  { id: 'cat_nt', name: '南通市', order: 2 },
  { id: 'cat_sz', name: '苏州市', order: 3 },
];

export const INITIAL_BRANCHES: Branch[] = [
  { id: '1', name: '盐城总部', address: '盐城市盐都区世纪大道99号金融城 12F', phone: '0515-88888888', manager: '张总', coordinates: { lat: 33.347, lng: 120.163 }, categoryId: 'cat_hq' },
  { id: '2', name: '南京分公司', address: '南京市建邺区江东中路 108 号', phone: '025-88888888', manager: '李经理', coordinates: { lat: 32.060, lng: 118.796 }, categoryId: 'cat_nt' }, 
  { id: '3', name: '苏州分公司', address: '苏州市工业园区星湖街 328 号', phone: '0512-88888888', manager: '王经理', coordinates: { lat: 31.298, lng: 120.585 }, categoryId: 'cat_sz' },
  { id: '4', name: '建湖分公司', address: '盐城市建湖县人民路 88 号', phone: '0515-86223344', manager: '刘主任', coordinates: { lat: 33.472, lng: 119.799 }, categoryId: 'cat_yc' },
  { id: '5', name: '东台分公司', address: '盐城市东台市海陵中路 12 号', phone: '0515-85223344', manager: '陈主任', coordinates: { lat: 32.852, lng: 120.313 }, categoryId: 'cat_yc' },
  { id: '6', name: '启东分公司', address: '南通市启东市汇龙镇世纪大道 58 号', phone: '0513-83334455', manager: '赵经理', coordinates: { lat: 31.811, lng: 121.657 }, categoryId: 'cat_nt' },
];

export const INITIAL_LINKS: NavigationLink[] = [
  { id: '1', title: '江苏省住房和城乡建设厅', url: 'http://jsszfhcxjst.jiangsu.gov.cn/', category: '政府监管平台', description: '全省住建政策发布、企业资质查询、人员资格管理' },
];

export const COMPANY_HISTORY: HistoryEvent[] = [
  { id: '1', year: '2010', title: '公司成立', description: '江苏盐韵工程项目管理有限公司在盐城正式注册成立。' },
  { id: '2', year: '2013', title: '资质升级', description: '获得房屋建筑工程监理乙级资质，业务范围进一步扩大。' },
  { id: '3', year: '2016', title: '甲级资质', description: '顺利晋升为国家房屋建筑工程监理甲级资质企业。' },
  { id: '4', year: '2019', title: '全省布局', description: '相继在南京、苏州设立分公司，开启全省化战略布局。' },
  { id: '5', year: '2023', title: '数字化转型', description: '全面引入数字化管理平台，获评“省优秀工程管理企业”。' },
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: '1', name: '张伟', role: '总经理 / 高级工程师', description: '拥有20年大型工程管理经验，江苏省优秀总监理工程师。', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop' },
  { id: '2', name: '李晓红', role: '总工程师', description: '国家注册监理工程师、一级建造师，擅长复杂结构工程技术攻关。', imageUrl: 'https://images.unsplash.com/photo-1573496359-136d475583dc?q=80&w=1969&auto=format&fit=crop' },
  { id: '3', name: '王强', role: '副总经理', description: '负责公司市场运营与战略规划，深耕招投标领域多年。', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' },
];

export const INITIAL_PARTNERS: Partner[] = [
  { id: '1', name: '中国建筑', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/CSCEC_logo.svg', website: 'https://www.cscec.com' },
  { id: '2', name: '万科地产', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vanke_logo.svg/1200px-Vanke_logo.svg.png', website: 'https://www.vanke.com' },
  { id: '3', name: '碧桂园', logoUrl: '', website: 'https://www.bgy.com.cn' },
  { id: '4', name: '保利发展', logoUrl: '', website: 'https://www.poly.com.cn' },
  { id: '5', name: '绿地集团', logoUrl: '', website: 'https://www.greenlandsc.com' },
  { id: '6', name: '融创中国', logoUrl: '', website: 'https://www.sunac.com.cn' },
];

export const INITIAL_HONOR_CATEGORIES: HonorCategory[] = [
  { id: 'cat_comp', name: '公司荣誉', order: 1 },
  { id: 'cat_qual', name: '资格证书', order: 2 },
  { id: 'cat_iso', name: 'ISO证书', order: 3 },
  { id: 'cat_aaa', name: 'AAA证书', order: 4 },
  { id: 'cat_domain', name: '域名证书', order: 5 },
  { id: 'cat_tm', name: '商标著作', order: 6 },
];

export const INITIAL_HONORS: Honor[] = [
  { id: '1', title: '工程监理综合甲级资质', issueDate: '2020-05', issuingAuthority: '住房和城乡建设部', content: '<h3>资质说明</h3><p>该资质是我司核心竞争力的体现，标志着我司具备承接所有专业类别建设工程项目的工程监理业务能力。无需受工程类别和等级限制。</p>', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+A', categoryId: 'cat_qual' },
  { id: '2', title: '江苏省优秀监理企业', issueDate: '2022-12', issuingAuthority: '江苏省建设监理协会', content: '<p>表彰我司在过去一年中在工程质量管理、安全生产监督等方面的优异表现。</p>', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+B', categoryId: 'cat_comp' },
  { id: '3', title: 'ISO9001质量管理体系认证', issueDate: '2021-06', issuingAuthority: '中国质量认证中心', content: '', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+C', categoryId: 'cat_iso' },
  { id: '4', title: 'AAA级信用企业', issueDate: '2023-01', issuingAuthority: '企业信用评价中心', content: '', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+D', categoryId: 'cat_aaa' },
  { id: '5', title: 'yanyun.com 域名注册证书', issueDate: '2010-01', issuingAuthority: 'CNNIC', content: '', imageUrl: 'https://placehold.co/400x300/eee/333?text=Domain+Cert', categoryId: 'cat_domain' },
  { id: '6', title: '盐韵品牌商标注册证', issueDate: '2011-03', issuingAuthority: '国家知识产权局', content: '', imageUrl: 'https://placehold.co/300x400/eee/333?text=Trademark', categoryId: 'cat_tm' },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    content: '盐韵团队在项目全过程中展现出的专业素养令人印象深刻。特别是在工期紧张的情况下，通过科学的统筹管理，确保了项目提前竣工。',
    author: '刘建国',
    position: '项目总指挥',
    company: '盐城城投集团',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: '2',
    content: '作为一家对质量要求极高的开发商，我们很庆幸选择了盐韵。他们的监理工程师不仅负责任，还主动利用BIM技术为我们规避了多处设计冲突。',
    author: '陈明',
    position: '区域总经理',
    company: '融创中国（江苏区）',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  }
];
