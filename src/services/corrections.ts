/**
 * corrections.ts — 纠错记录本地存储封装
 *
 * ⚠️  接后端时替换说明（在 src/services/api.ts 新增以下函数）：
 *   saveCorrection()  → POST  /api/corrections
 *   listCorrections() → GET   /api/corrections  （管理员鉴权）
 *
 * 替换时只需修改本文件的两个导出函数，组件层无需改动。
 */

const CORRECTIONS_KEY = 'cargo_corrections';

export interface Correction {
  id: string;
  submittedAt: string;          // ISO 8601
  source: 'air' | 'sea';       // 来源表格
  company: string;              // 对应公司名
  originalRecord: Record<string, unknown>; // 原始行数据快照
  correctionType: string;       // 纠错类型
  suggestedValue: string;       // 建议新值
  notes: string;                // 备注说明
  contactEmail?: string;        // 联系邮箱（可选）
}

/** 保存一条纠错记录 → 替换为 POST /api/corrections */
export const saveCorrection = (
  data: Omit<Correction, 'id' | 'submittedAt'>
): Correction => {
  const correction: Correction = {
    ...data,
    id: `corr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    submittedAt: new Date().toISOString(),
  };
  const list = listCorrections();
  list.unshift(correction); // 最新在前
  localStorage.setItem(CORRECTIONS_KEY, JSON.stringify(list));
  console.log('[Correction Submitted]', correction); // 接 API 前临时输出
  return correction;
};

/** 读取所有纠错记录 → 替换为 GET /api/corrections */
export const listCorrections = (): Correction[] => {
  try {
    const raw = localStorage.getItem(CORRECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
