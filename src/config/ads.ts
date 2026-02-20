/**
 * ads.ts — 广告位统一开关配置
 *
 * enabled = true  → 显示占位框（开发/测试阶段）
 * enabled = false → 渲染等高透明占位，保持布局稳定
 *
 * 接入 Google AdSense 步骤：
 * 1. 在 public/index.html 引入 AdSense <script>（不要写在组件内）
 * 2. 将 AdSlot.tsx 内 {/* TODO: 替换为 <ins class="adsbygoogle" ... /> *\/} 注释处
 *    改为真实的 <ins> 标签，并调用 (adsbygoogle = window.adsbygoogle || []).push({})
 * 3. 把下面对应 slot 的 enabled 改为 true
 *
 * 新增广告位步骤：
 * 1. 在下面 AD_CONFIG 加一条 key（例如 sea_top_banner: true）
 * 2. 在目标页面引入 <AdSlot slotId="sea_top_banner" variant="banner" enabled={AD_CONFIG.sea_top_banner} />
 */

export const AD_CONFIG: Record<string, boolean> = {
  home_top_banner:      true,   // 首页顶部横幅
  airfreight_sidebar:   true,   // 空运比价右侧栏
  airfreight_infeed:    true,   // 空运比价表格下方
};
