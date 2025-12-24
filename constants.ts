
import { Branch, HistoryEvent, Honor, NavigationLink, NewsItem, Partner, ProjectCase, Role, Service, SiteSettings, TeamMember, Testimonial, User, ResourceType, MediaItem, PageContent } from './types';

// Helper to create full permissions
const fullAccess = { read: true, write: true, delete: true };
const readOnly = { read: true, write: false, delete: false };
const noAccess = { read: false, write: false, delete: false };

export const RESOURCES: {id: ResourceType, label: string}[] = [
  { id: 'pages', label: '页面内容' },
  { id: 'news', label: '新闻动态' },
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
    lastLogin: '2023-12-01 09:00'
  }
];

// ... existing constants ...

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: '江苏盐韵荣获“省优秀工程管理企业”称号',
    summary: '在近日召开的江苏省建筑行业年度大会上，我司凭借优异的项目管理业绩荣获表彰。',
    content: '...',
    date: '2023-10-15',
    category: '公司新闻',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1932&auto=format&fit=crop'
  },
  {
    id: '2',
    title: '盐城滨海新区重点项目顺利竣工验收',
    summary: '由我司负责监理的滨海新区商业综合体项目今日顺利通过竣工验收。',
    content: '...',
    date: '2023-11-02',
    category: '项目动态',
    published: true,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '3',
    title: '关于加强冬季施工安全管理的通知',
    summary: '为确保冬季施工安全，公司技术部下发最新安全管理规范。',
    content: '...',
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
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop',
    location: '滨海县',
    date: '2023-03',
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

export const INITIAL_BRANCHES: Branch[] = [
  { id: '1', name: '盐城总部', address: '盐城市盐都区世纪大道99号金融城 12F', phone: '0515-88888888', manager: '张总', coordinates: { lat: 33.347, lng: 120.163 } },
  { id: '2', name: '南京分公司', address: '南京市建邺区江东中路 108 号', phone: '025-88888888', manager: '李经理', coordinates: { lat: 32.060, lng: 118.796 } },
  { id: '3', name: '苏州分公司', address: '苏州市工业园区星湖街 328 号', phone: '0512-88888888', manager: '王经理', coordinates: { lat: 31.298, lng: 120.585 } },
];

export const INITIAL_LINKS: NavigationLink[] = [
  // 1. 政府监管平台
  { id: '1', title: '江苏省住房和城乡建设厅', url: 'http://jsszfhcxjst.jiangsu.gov.cn/', category: '政府监管平台', description: '全省住建政策发布、企业资质查询、人员资格管理' },
  { id: '2', title: '盐城市住房和城乡建设局', url: 'http://zfhcxjsj.yancheng.gov.cn/', category: '政府监管平台', description: '本地住建政策、工程审批、市场监管、安全质量监督' },
  { id: '3', title: '江苏省公共资源交易网', url: 'http://jsggzy.jszwfw.gov.cn/', category: '政府监管平台', description: '全省工程招投标、政府采购、土地出让信息发布与交易' },
  { id: '4', title: '盐城市公共资源交易中心', url: 'https://ggzy.yancheng.gov.cn/', category: '政府监管平台', description: '本地工程招投标、政府采购信息发布与交易' },
  { id: '5', title: '江苏省建筑市场监管平台', url: 'http://49.77.204.6:17001/Website/#/', category: '政府监管平台', description: '企业资质、人员注册、项目业绩、信用记录查询' },
  { id: '6', title: '盐城市交通运输局', url: 'https://ycjtj.yancheng.gov.cn/', category: '政府监管平台', description: '交通工程招投标、工程建设管理、公路水运工程监管' },
  { id: '7', title: '盐城市水利局', url: 'http://slj.yancheng.gov.cn/', category: '政府监管平台', description: '水利工程招投标、水利建设项目监管、水利工程质量监督' },
  { id: '8', title: '盐城市自然资源和规划局', url: 'http://zrzy.jiangsu.gov.cn/yc/', category: '政府监管平台', description: '土地出让、规划许可、不动产登记、地质勘察监管' },
  { id: '9', title: '江苏省建设工程质量监督网', url: 'http://www.jszljd.com', category: '政府监管平台', description: '工程质量监督、检测机构管理、质量事故通报' },
  { id: '10', title: '江苏省建设工程安全监督网', url: 'http://www.jscin.gov.cn/jsaj', category: '政府监管平台', description: '工程安全监管、安全生产许可证管理、安全事故通报' },

  // 2. 招投标与采购平台
  { id: '11', title: '江苏建设工程招标网', url: 'http://www.jszb.com.cn/', category: '招投标与采购平台', description: '全省建设工程招投标信息发布、招标文件下载、中标公示' },
  { id: '12', title: '江苏政府采购网', url: 'http://www.ccgp-jiangsu.gov.cn/', category: '招投标与采购平台', description: '政府投资项目采购信息发布、采购文件下载、合同备案' },
  { id: '13', title: '盐城市建设工程招投标网', url: 'https://ycggzy.jszwfw.gov.cn/gb-web/#/login', category: '招投标与采购平台', description: '盐城市建设工程招投标信息发布、投标、开标、评标' },
  { id: '14', title: '中国招标投标公共服务平台', url: 'http://gjpt.ahtba.org.cn/', category: '招投标与采购平台', description: '全国招投标信息汇总、跨区域项目查询、行业监管' },
  { id: '15', title: '全国公共资源交易平台', url: 'https://www.ggzy.gov.cn/', category: '招投标与采购平台', description: '全国公共资源交易信息集中发布、跨区域交易查询' },
  { id: '16', title: '云筑网', url: 'https://www.yzw.cn/', category: '招投标与采购平台', description: '建筑行业招投标、供应链管理、企业采购服务' },
  { id: '17', title: '筑材网', url: 'https://www.zhucai.com/', category: '招投标与采购平台', description: '建筑材料招投标采购、供应商管理、合同管理' },
  { id: '18', title: '中国通用招标网', url: 'https://www.china-tender.com.cn/', category: '招投标与采购平台', description: '工程、货物、服务招标代理，招投标全流程服务' },
  { id: '19', title: '江苏省水利工程建设招投标平台', url: 'https://jswater.jiangsu.gov.cn/col/col80020/', category: '招投标与采购平台', description: '全省水利工程招投标信息发布与监管' },
  { id: '20', title: '盐城市政府采购网', url: 'http://zfcg.yancheng.gov.cn/', category: '招投标与采购平台', description: '盐城市政府采购信息发布、采购文件下载、合同备案' },

  // 3. 工程造价与材料信息
  { id: '21', title: '江苏省工程造价信息网', url: 'http://www.jszj.com.cn/', category: '工程造价与材料信息', description: '全省工程计价依据、材料价格信息、造价政策发布' },
  { id: '22', title: '盐城市工程造价信息网', url: 'https://www.costku.com/yancheng/', category: '工程造价与材料信息', description: '盐城市材料价格信息、工程造价政策、信息价查询下载' },
  { id: '23', title: '造价通(江苏站)', url: 'http://js.zjtcn.com', category: '工程造价与材料信息', description: '材料价格查询、询价、云造价服务、工程造价咨询' },
  { id: '24', title: '江苏省工程材料价格信息平台', url: 'https://jiangsu.gxzjxh.cn/', category: '工程造价与材料信息', description: '全省建材价格信息发布、价格指数查询、历史价格对比' },
  { id: '25', title: '盐城市建设工程材料价格信息平台', url: 'https://www.costku.com/36001.html', category: '工程造价与材料信息', description: '盐城市建材价格发布、价格动态监测、材料价格查询' },
  { id: '26', title: '江苏省交通工程定额站', url: 'http://jtyst.jiangsu.gov.cn/', category: '工程造价与材料信息', description: '交通工程造价依据、公路水运工程材料价格发布' },
  { id: '27', title: '江苏省水利工程造价管理网', url: 'https://jswater.jiangsu.gov.cn/col/col80021/', category: '工程造价与材料信息', description: '水利工程造价依据、水利工程材料价格发布' },
  { id: '28', title: '江苏造价信息网(速得材价)', url: 'https://www.jszjxh.com/', category: '工程造价与材料信息', description: '全省材料价格查询系统、"速得"材价APP下载' },

  // 4. 工程技术资料与标准
  { id: '29', title: '建标知网', url: 'https://www.kscecs.com/', category: '工程技术资料与标准', description: '工程建设法律法规、标准规范检索、在线阅读、下载' },
  { id: '30', title: '中国建筑标准设计研究院', url: 'http://www.cbsd.cn/', category: '工程技术资料与标准', description: '国家标准图集、设计规范、施工标准发布与下载' },
  { id: '31', title: '江苏省工程建设标准网', url: 'https://pan.clooo.cn/', category: '工程技术资料与标准', description: '江苏省工程建设地方标准发布、下载、查询' },
  { id: '32', title: '筑龙网', url: 'https://www.zhulong.com/', category: '工程技术资料与标准', description: '工程资料下载、施工方案、技术交底、行业论坛交流' },
  { id: '33', title: '建库网', url: 'https://www.jianku.com/', category: '工程技术资料与标准', description: '建筑图纸、设计方案、施工组织设计免费下载' },
  { id: '34', title: '中国建筑技术网', url: 'https://www.building.hc360.com/', category: '工程技术资料与标准', description: '建筑技术资料、施工工艺、工程案例、技术标准查询' },

  // 5. BIM与工程技术应用
  { id: '35', title: '中国BIM门户', url: 'https://www.bimcn.org/', category: 'BIM与工程技术应用', description: 'BIM技术资讯、软件教程、应用案例、行业标准发布' },
  { id: '36', title: 'BIM建筑网', url: 'https://www.bimii.com/', category: 'BIM与工程技术应用', description: 'BIM技术推广、软件培训、项目咨询、行业交流平台' },
  { id: '37', title: '广联达BIM平台', url: 'https://bim.glodon.com/', category: 'BIM与工程技术应用', description: 'BIM软件下载、培训、项目协同、造价一体化解决方案' },
  { id: '38', title: '鲁班工程管理数字平台', url: 'https://www.luban.com/', category: 'BIM与工程技术应用', description: 'BIM模型管理、施工模拟、碰撞检测、进度控制' },
  { id: '39', title: '万间云-BIM数字建造平台', url: 'https://www.vanjian.com/', category: 'BIM与工程技术应用', description: 'BIM+IoT全生命周期管理、智慧工地、数字孪生应用' },

  // 6. 工程人才与企业服务
  { id: '40', title: '江苏建设人才网', url: 'https://www.jsjsrc.com/', category: '工程人才与企业服务', description: '建筑人才招聘、求职、培训、证书挂靠、猎头服务' },
  { id: '41', title: '盐城市建筑人才网', url: 'https://www.ycjsrc.com/', category: '工程人才与企业服务', description: '盐城市本地建筑人才招聘、求职信息发布' },
  { id: '42', title: '江苏省人才服务云平台', url: 'https://www.jssrcfwypt.org.cn/', category: '工程人才与企业服务', description: '全省建筑人才招聘、人事代理、职称评定服务' },
  { id: '43', title: '建筑英才网(江苏站)', url: 'https://www.buildhr.com/jiangsu/', category: '工程人才与企业服务', description: '建筑行业专业人才招聘、求职、人才测评服务' },
  { id: '44', title: '江苏省工程咨询中心', url: 'https://www.cnjecc.com/', category: '工程人才与企业服务', description: '工程咨询、造价咨询、招标代理、项目管理、评估咨询' },
  { id: '45', title: '江苏省规划设计集团', url: 'https://www.jspdg.com/', category: '工程人才与企业服务', description: '规划设计、建筑设计、市政设计、工程总承包服务' },

  // 7. 工程管理与施工服务
  { id: '46', title: '乐建宝工程项目管理平台', url: 'https://www.gcb365.com/', category: '工程管理与施工服务', description: '施工项目管理、移动办公、智慧工地、劳务管理、数据分析' },
  { id: '47', title: '斗栱云工程管理系统', url: 'https://www.dougongyun.com/', category: '工程管理与施工服务', description: '建筑总包、装饰、电力工程全流程管理解决方案' },
  { id: '48', title: '筑云科技-BIMCC数字建造平台', url: 'https://www.bimcc.net/', category: '工程管理与施工服务', description: 'BIM+GIS+BIMVR多引擎技术、智慧工地、进度质量安全管理' },
  { id: '49', title: '江苏省工程档案资料管理系统', url: 'http://www.jsgcda.com/', category: '工程管理与施工服务', description: '工程资料编制、归档、查询、档案验收服务' },
  { id: '50', title: '盐城市工程建设项目审批管理系统', url: 'https://yc.jszwfw.gov.cn/col/col181563/index.html', category: '工程管理与施工服务', description: '工程建设项目一站式审批、在线申报、进度查询' },
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
  { id: '1', name: '中国建筑', logoUrl: '', website: 'https://www.cscec.com' },
  { id: '2', name: '万科地产', logoUrl: '', website: 'https://www.vanke.com' },
  { id: '3', name: '碧桂园', logoUrl: '', website: 'https://www.bgy.com.cn' },
  { id: '4', name: '保利发展', logoUrl: '', website: 'https://www.poly.com.cn' },
  { id: '5', name: '绿地集团', logoUrl: '', website: 'https://www.greenlandsc.com' },
  { id: '6', name: '融创中国', logoUrl: '', website: 'https://www.sunac.com.cn' },
  { id: '7', name: '中海地产', logoUrl: '', website: 'https://www.coli.com.hk' },
  { id: '8', name: '华润置地', logoUrl: '', website: 'https://www.crland.com.hk' },
  { id: '9', name: '龙湖集团', logoUrl: '', website: 'https://www.longfor.com' },
  { id: '10', name: '招商蛇口', logoUrl: '', website: 'https://www.cmsk1979.com' },
  { id: '11', name: '建发房产', logoUrl: '', website: 'https://www.cndrealty.com' },
  { id: '12', name: '滨江集团', logoUrl: '', website: 'https://www.binjiang.com.cn' },
  { id: '13', name: '绿城中国', logoUrl: '', website: 'https://www.chinagreentown.com' },
  { id: '14', name: '金地集团', logoUrl: '', website: 'https://www.gemdale.com' },
  { id: '15', name: '新城控股', logoUrl: '', website: 'https://www.seazen.com.cn' },
];

export const INITIAL_HONORS: Honor[] = [
  { id: '1', title: '工程监理综合甲级资质', issueDate: '2020-05', issuingAuthority: '住房和城乡建设部', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+A' },
  { id: '2', title: '江苏省优秀监理企业', issueDate: '2022-12', issuingAuthority: '江苏省建设监理协会', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+B' },
  { id: '3', title: 'ISO9001质量管理体系认证', issueDate: '2021-06', issuingAuthority: '中国质量认证中心', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+C' },
  { id: '4', title: 'AAA级信用企业', issueDate: '2023-01', issuingAuthority: '企业信用评价中心', imageUrl: 'https://placehold.co/300x400/fff/gold?text=Certificate+D' },
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

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: '江苏盐韵工程项目管理有限公司',
  logoUrl: 'https://placehold.co/538x96/2C388B/ffffff?text=Jiangsu+Yanyun',
  themeColor: '#2C388B',
  contactPhone: '0515-88888888',
  contactEmail: 'info@yanyun.com',
  contactAddress: '江苏省盐城市盐都区世纪大道99号金融城 12F',
  copyrightText: '© 2024 江苏盐韵工程项目管理有限公司. All rights reserved.'
};

export const INITIAL_MEDIA: MediaItem[] = [
  { id: '1', name: '项目现场 01', type: 'image', category: '工程现场', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop', uploadDate: '2024-01-10', size: '1.2 MB' },
  { id: '2', name: '团队合影', type: 'image', category: '团队风采', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop', uploadDate: '2024-01-12', size: '2.5 MB' },
  { id: '3', name: '企业宣传片', type: 'video', category: '宣传资料', url: 'https://www.youtube.com/watch?v=ScMzIvxBSi4', uploadDate: '2024-01-15', size: 'Link' },
];

export const INITIAL_PAGE_CONTENT: PageContent = {
  headers: {
    about: { title: '关于盐韵', subtitle: '以匠心致初心，以品质筑未来', backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
    services: { title: '业务领域', subtitle: '提供全生命周期的工程咨询解决方案', backgroundImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2031&auto=format&fit=crop' },
    cases: { title: '经典案例', subtitle: '见证城市发展，筑造精品工程', backgroundImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop' },
    news: { title: '新闻动态', subtitle: '关注盐韵动态，了解行业资讯', backgroundImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop' },
    branches: { title: '分支机构', subtitle: '服务网络覆盖全省，快速响应客户需求', backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop' },
    contact: { title: '联系我们', subtitle: '期待与您的合作，共创美好未来', backgroundImage: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop' },
    navigation: { title: '行业资源导航', subtitle: '汇集权威网站，助您快速获取行业政策与商机', backgroundImage: '' }, // Nav page often has custom header or simple one
  },
  home: {
    hero: {
      badge: '累计管理项目金额超 500 亿',
      titleLine1: '让每一个工程',
      titleHighlight: '更安全、更高效、更增值',
      description: '江苏盐韵，您身边的工程全生命周期管理专家。我们通过标准化管理与数字化技术，为投资方规避风险，创造超越预期的工程价值。',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    },
    stats: {
      stat1: { value: '13+', label: '年行业经验' },
      stat2: { value: '500+', label: '成功交付项目' },
      stat3: { value: '100%', label: '竣工验收合格率' },
      stat4: { value: '0', label: '重大安全事故' },
    },
    process: {
      title: '标准化管理流程',
      description: '我们将复杂的工程管理转化为可视化、可控的标准化流程。',
      steps: [
        { title: '前期策划', desc: '风险评估与合规性审查' },
        { title: '过程控制', desc: '质量/进度/造价三控管理' },
        { title: '数字化监测', desc: 'BIM+智慧工地实时反馈' },
        { title: '竣工交付', desc: '完美交付与后期运维' },
      ]
    },
    cta: {
      title: '准备好开始您的项目了吗？',
      description: '无论项目规模大小，我们都准备好为您提供专业的咨询建议。'
    }
  },
  about: {
    intro: {
      title: '公司简介',
      content1: '江苏盐韵工程项目管理有限公司成立于2010年，是一家集工程监理、项目管理、造价咨询、招标代理于一体的综合性工程咨询企业。公司注册资本5000万元，拥有国家房屋建筑工程监理甲级、市政公用工程监理甲级等核心资质。',
      content2: '多年来，我们始终秉持“专业、诚信、高效、创新”的企业精神，深耕江苏，辐射全国。累计完成各类工程项目管理服务超过500项，获得“江苏省优秀监理企业”、“盐城市先进集体”等多项荣誉称号。',
      imageUrl: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070&auto=format&fit=crop'
    },
    culture: {
      mission: '为客户创造最大价值，为社会建设精品工程。',
      values: '诚信为本，质量第一，合作共赢，追求卓越。',
      management: '以人为本，科学管理，规范运作，持续改进。'
    }
  },
  services: {
    introStats: [
      { icon: 'Shield', label: "合规保障", desc: "100% 规避法律风险" },
      { icon: 'Clock', label: "进度控制", desc: "平均工期缩短 15%" },
      { icon: 'TrendingUp', label: "成本优化", desc: "平均节约预算 8%" },
      { icon: 'Users', label: "专家团队", desc: "人均 10 年+ 经验" },
    ],
    faqs: [
      { q: "全过程工程咨询包含哪些具体内容？", a: "包含项目前期策划、可行性研究、工程监理、造价咨询、招标代理及后期运维管理等全生命周期服务。" },
      { q: "如何保障项目的成本控制？", a: "我们通过限额设计、全过程造价跟踪审计、变更严格管控以及市场价格实时监测数据库，确保每一分钱都花在刀刃上。" },
      { q: "你们是否具备跨省服务的资质与能力？", a: "是的，我司持有国家甲级监理资质，业务已覆盖华东、华北多个省份，并在南京、苏州等地设有直属分公司。" },
    ]
  }
};
