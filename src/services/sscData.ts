/**
 * sscData.ts — SaveShipCost 平台数据层
 * 所有新功能的 localStorage 封装，与原有 storage.ts 独立
 */

export const ADMIN_PASS = 'ssc2026!';

// ─── Keys ─────────────────────────────────────────────────────────────────────
const ADMIN_AUTH_KEY = 'ssc_admin_auth';
const DELIVERY_KEY   = 'ssc_delivery_updates';
const MERCHANTS_KEY  = 'ssc_merchants';
const SSC_POSTS_KEY  = 'ssc_posts';
export const ADS_KEY = 'ssc_ads';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DeliveryUpdate {
  id: string;
  departDate: string;        // YYYY-MM-DD
  route: 'CN->CA' | 'CA->CN';
  city: string;
  merchantId: string;
  merchantName: string;
  eta: string;               // e.g. "7-10天"
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  mode: 'air' | 'sea';
  cargo: 'general' | 'sensitive';
  speed: 'fast' | 'standard';
  name: string;
  etaMin: number;
  etaMax: number;
}

export interface Merchant {
  id: string;
  name: string;
  cities: string[];
  intro: string;
  contact: string;           // 多行文本块
  wechatQrUrl?: string;
  services: ServiceItem[];
}

export interface SscPost {
  id: string;
  authorEmail: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'active' | 'deleted';
  deleteReason?: string;
}

// ─── Default data ─────────────────────────────────────────────────────────────

const DEFAULT_MERCHANTS: Merchant[] = [
  {
    id: 'm001',
    name: '铭创优国际快递',
    cities: ['Ottawa', 'Toronto', 'Vancouver'],
    intro: '专注中加跨境物流10年，提供空运、海运、普货敏货全覆盖服务，拥有稳定的仓储网络和专业的清关团队。时效稳定，价格透明，深受加拿大华人信赖。',
    contact: '微信：mingchuangyou_official\n电话：+1-613-555-0101\n邮箱：info@mingchuangyou.ca\n网站：www.mingchuangyou.ca',
    wechatQrUrl: '',
    services: [
      { id: 's1', mode: 'air', cargo: 'general', speed: 'fast',     name: '空运快线普货', etaMin: 5,  etaMax: 7  },
      { id: 's2', mode: 'air', cargo: 'sensitive', speed: 'standard', name: '空运慢线敏货', etaMin: 10, etaMax: 15 },
      { id: 's3', mode: 'sea', cargo: 'general', speed: 'standard', name: '海运普船普货', etaMin: 30, etaMax: 45 },
    ],
  },
  {
    id: 'm002',
    name: '速比迪快递',
    cities: ['Ottawa'],
    intro: '渥太华本地专线快递，在Ottawa多个社区设有自提点（Barrhaven、Kanata、Stittsville等），提供灵活上门取件与自提服务，适合小批量寄件需求。',
    contact: '微信：subidi_ottawa\n电话：+1-613-555-0202\n邮箱：ottawa@subidi.ca',
    wechatQrUrl: '',
    services: [
      { id: 's4', mode: 'air', cargo: 'general',   speed: 'fast', name: '空运快线普货', etaMin: 5, etaMax: 8  },
      { id: 's5', mode: 'air', cargo: 'sensitive',  speed: 'fast', name: '空运快线敏货', etaMin: 7, etaMax: 10 },
    ],
  },
  {
    id: 'm003',
    name: '万象美驿',
    cities: ['Ottawa', 'Montreal'],
    intro: '微信小程序一键下单，智能仓储系统，海运空运双线服务，支持普货敏货全品类，价格透明，自动化操作效率高，覆盖Montreal与Ottawa双城。',
    contact: '微信：wanxiang_meyi\n电话：+1-514-555-0303\n邮箱：contact@wanxiangmeyi.com',
    wechatQrUrl: '',
    services: [
      { id: 's6', mode: 'air', cargo: 'general',   speed: 'standard', name: '空运慢线普货', etaMin: 8,  etaMax: 12 },
      { id: 's7', mode: 'sea', cargo: 'general',   speed: 'fast',     name: '海运快船普货', etaMin: 30, etaMax: 40 },
      { id: 's8', mode: 'sea', cargo: 'sensitive', speed: 'standard', name: '海运普船敏货', etaMin: 45, etaMax: 60 },
    ],
  },
];

const DEFAULT_DELIVERY_UPDATES: DeliveryUpdate[] = [
  { id: 'd001', departDate: '2026-02-10', route: 'CN->CA', city: 'Ottawa',    merchantId: 'm001', merchantName: '铭创优国际快递', eta: '7-10天',  createdAt: new Date().toISOString() },
  { id: 'd002', departDate: '2026-02-12', route: 'CN->CA', city: 'Ottawa',    merchantId: 'm002', merchantName: '速比迪快递',     eta: '5-7天',   createdAt: new Date().toISOString() },
  { id: 'd003', departDate: '2026-02-15', route: 'CN->CA', city: 'Toronto',   merchantId: 'm001', merchantName: '铭创优国际快递', eta: '5-7天',   createdAt: new Date().toISOString() },
  { id: 'd004', departDate: '2026-02-18', route: 'CA->CN', city: 'Ottawa',    merchantId: 'm003', merchantName: '万象美驿',       eta: '30-40天', createdAt: new Date().toISOString() },
  { id: 'd005', departDate: '2026-02-20', route: 'CN->CA', city: 'Vancouver', merchantId: 'm001', merchantName: '铭创优国际快递', eta: '10-14天', createdAt: new Date().toISOString() },
];

const DEFAULT_POSTS: SscPost[] = [
  {
    id: 'p001',
    authorEmail: 'user1@example.com',
    authorName: '渥太华买家小明',
    title: '求推荐：Ottawa 收首重拼邮的靠谱商家',
    content: '最近想从国内寄几件衣服过来，大概4-5kg，首重价格比较贵，想找人拼邮节省运费。有没有在Ottawa用过首重拼邮的朋友推荐一下？',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'active',
  },
  {
    id: 'p002',
    authorEmail: 'user2@example.com',
    authorName: '新移民打听价格',
    title: '铭创优和速比迪哪个更便宜？',
    content: '我刚到渥太华，想寄一些日用品从国内过来，主要是普货，重量大概10kg左右。有人比较过这两家的价格吗？',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'active',
  },
  {
    id: 'p003',
    authorEmail: 'user3@example.com',
    authorName: '海淘达人',
    title: '分享一次海运经验，30天到货！',
    content: '上次用万象美驿寄了一批书和厨具，海运普船，2月初发货，刚才收到通知到Ottawa了，前后30天左右，价格也很实惠，强烈推荐！',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    status: 'active',
  },
];

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export const isAdminLoggedIn = (): boolean =>
  localStorage.getItem(ADMIN_AUTH_KEY) === 'true';

export const adminLogin = (pass: string): boolean => {
  if (pass === ADMIN_PASS) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const adminLogout = (): void => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
};

// ─── Delivery Updates ─────────────────────────────────────────────────────────

export const getDeliveryUpdates = (): DeliveryUpdate[] => {
  try {
    const raw = localStorage.getItem(DELIVERY_KEY);
    if (!raw) {
      localStorage.setItem(DELIVERY_KEY, JSON.stringify(DEFAULT_DELIVERY_UPDATES));
      return DEFAULT_DELIVERY_UPDATES;
    }
    return JSON.parse(raw) as DeliveryUpdate[];
  } catch {
    return [...DEFAULT_DELIVERY_UPDATES];
  }
};

export const saveDeliveryUpdates = (updates: DeliveryUpdate[]): void => {
  localStorage.setItem(DELIVERY_KEY, JSON.stringify(updates));
};

// ─── Merchants ────────────────────────────────────────────────────────────────

export const getMerchants = (): Merchant[] => {
  try {
    const raw = localStorage.getItem(MERCHANTS_KEY);
    if (!raw) {
      localStorage.setItem(MERCHANTS_KEY, JSON.stringify(DEFAULT_MERCHANTS));
      return DEFAULT_MERCHANTS;
    }
    return JSON.parse(raw) as Merchant[];
  } catch {
    return [...DEFAULT_MERCHANTS];
  }
};

export const saveMerchants = (merchants: Merchant[]): void => {
  localStorage.setItem(MERCHANTS_KEY, JSON.stringify(merchants));
};

export const getMerchantById = (id: string): Merchant | undefined =>
  getMerchants().find((m) => m.id === id);

// ─── SSC Posts ────────────────────────────────────────────────────────────────

export const getSscPosts = (): SscPost[] => {
  try {
    const raw = localStorage.getItem(SSC_POSTS_KEY);
    if (!raw) {
      localStorage.setItem(SSC_POSTS_KEY, JSON.stringify(DEFAULT_POSTS));
      return DEFAULT_POSTS;
    }
    return JSON.parse(raw) as SscPost[];
  } catch {
    return [...DEFAULT_POSTS];
  }
};

export const saveSscPosts = (posts: SscPost[]): void => {
  localStorage.setItem(SSC_POSTS_KEY, JSON.stringify(posts));
};

export const createSscPost = (
  author: { email: string; username: string },
  title: string,
  content: string,
): SscPost => {
  const post: SscPost = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorEmail: author.email,
    authorName: author.username,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  const posts = getSscPosts();
  posts.unshift(post);
  saveSscPosts(posts);
  return post;
};
