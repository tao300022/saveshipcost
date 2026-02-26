/**
 * storage.ts — localStorage 封装层（MVP 阶段）
 *
 * ⚠️  接后端时替换说明：
 *   - authRegister()   → POST   /api/auth/register
 *   - authLogin()      → POST   /api/auth/login   (返回 JWT/session cookie)
 *   - getCurrentUser() → GET    /api/auth/me       (用 token 验证)
 *   - clearSession()   → POST   /api/auth/logout
 *   - fetchPosts()     → GET    /api/posts?page=1&limit=20
 *   - createPost()     → POST   /api/posts
 *
 * 接入后端只需新建 src/services/api.ts，把同名函数替换为 fetch/axios 调用，
 * 不需要改动 AuthContext 或 Forum 组件内部逻辑。
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoredUser {
  email: string;
  username: string;
  password: string; // TODO: 后端改为 bcrypt hash，前端不存密码
  createdAt: string;
}

export interface Post {
  id: string;
  authorEmail: string;
  authorName: string;
  title: string;
  content: string;
  createdAt: string; // ISO 8601
}

export interface SessionUser {
  email: string;
  username: string;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const USERS_KEY   = 'cargo_v2_users';
const SESSION_KEY = 'cargo_v2_session';
const POSTS_KEY   = 'cargo_v2_posts';

// ─── Users ────────────────────────────────────────────────────────────────────

const readUsers = (): Record<string, StoredUser> => {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeUsers = (users: Record<string, StoredUser>): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

/** 注册 → 替换为 POST /api/auth/register */
export const authRegister = (
  email: string,
  username: string,
  password: string,
): 'ok' | 'email_exists' => {
  const users = readUsers();
  const key = email.toLowerCase();
  if (users[key]) return 'email_exists';
  users[key] = { email: key, username, password, createdAt: new Date().toISOString() };
  writeUsers(users);
  return 'ok';
};

/** 登录 → 替换为 POST /api/auth/login */
export const authLogin = (
  email: string,
  password: string,
): SessionUser | null => {
  const users = readUsers();
  const user  = users[email.toLowerCase()];
  if (!user || user.password !== password) return null;
  return { email: user.email, username: user.username };
};

// ─── Session ──────────────────────────────────────────────────────────────────

/** 读取当前登录用户 → 替换为 GET /api/auth/me（携带 token） */
export const getCurrentUser = (): SessionUser | null => {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveSession = (user: SessionUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

/** 退出 → 替换为 POST /api/auth/logout（清除服务端 session/token） */
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

// ─── Posts ────────────────────────────────────────────────────────────────────

/** 获取帖子列表 → 替换为 GET /api/posts */
export const fetchPosts = (): Post[] => {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** 发布帖子 → 替换为 POST /api/posts */
export const createPost = (
  author: SessionUser,
  title: string,
  content: string,
): Post => {
  const post: Post = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    authorEmail: author.email,
    authorName: author.username,
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  const posts = fetchPosts();
  posts.unshift(post); // 最新在前
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return post;
};
