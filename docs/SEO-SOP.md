# SaveShipCost SEO 接管与监控 SOP

## 范围与当前状态

优先 Google 加拿大市场，英文和中文，法文作为第二批。关键词清单是业务候选，不是已确认搜索量或排名。中国市场另建筛选，不混入加拿大趋势。Semrush 的 ShipCanada 地图排名与本网站自然搜索排名分开。

Hermes 的 cargoA5-seo-test 已实现旧路由的客户端标题、描述、canonical、敏感页 noindex、NotFound 与部分可爬取链接。它有大量未提交改动，保留原样。本次以已合并广告修复的正式 main 为基线，不复制旧路由 canonical。正式版已有四语言共 44 个静态 head 页面，正文仍依赖 JavaScript，不能声称完成全文预渲染。

2026-09-27 生财 MCP 连接返回需要重新 OAuth 授权，本次尚未获得新的生财 SEO 检索结果。以下流程依据已核验网站和 Google 官方文档；生财指导必须在恢复后补上真实文章链接及适用条件，不能冒充已读取。

## 每日技术检查

运行 `python3 scripts/seo-monitor.py --output <日期目录>/audit.json`，只读取 sitemap 中的公开 HTML，不访问数据库、不运行广告。保留每次 UTC 时间、HTTP 状态、标题、描述、canonical、hreflang、分享标签。失败时返回非零状态并保留报告。首次报告是基线，后续比较新增异常；连接失败重试一次，持续失败才通知。原始 HTML 没有 H1 只记录 SPA 限制，不能等同渲染页面没有 H1。

每次 SEO 代码变更先 `npm run build`，再执行 `python3 scripts/seo-monitor.py --dist dist --output <日期目录>/build-audit.json`。本地通过不等同上线通过；PR 合并且部署成功后重跑线上检查。

## 每周关键词监控

数据源首选 Google Search Console 的 web 搜索、加拿大 CAN、移动端与桌面端分别记录。保留 property、日期区间、国家、设备、query、page、点击、曝光、平均位置以及提取时间。只用 finalized 数据。API 日期按美国太平洋时间；每周取最近已完整的 7 天与前 7 天，数据未完整则延后比较。

GSC 尚未授权或没有导出时，Excel 数据保持空白、状态为未接入；不能填 0 或虚构排名。GSC 的平均位置不是固定地理坐标的实时 SERP 排名。匿名查询及 API 行数限制意味着查询明细之和不一定等于网站总量。

导入表采用同一关键词、落地页、国家、设备的两段不重叠 7 天数据。CTR = 点击 / 曝光；排名提升 = 上期平均位置 - 本期平均位置。两期缺一时不计算提升。人工导出的查询表若没有 page 或 device 维度，不得推断这些维度，也不得合并到严格分组数据中。

## 每周一行动规则

1. 先处理状态码、误设 noindex、canonical/hreflang 冲突；不要先批量写文章。
2. 从真实曝光词选择 5–20 位且与业务一致的页面，核对搜索意图、报价日期、计费重和运输时效，再补充原创比较内容与站内链接。5–20 位是工作筛选范围，不是算法规则。
3. CTR 下降先比较同国家、设备、位置区间；不要仅凭低 CTR 批量改标题。
4. 每周最多先试 2 个核心页面，记录旧版、新版、原因、上线时间，观察至少 14–28 天。不能把同期排名变化全部归因于一次修改。
5. 新城市页必须有当地服务、可核验货代与差异内容。不要把同一模板换城市名大量发布；Ottawa 页面上的 city 查询参数不直接当成独立落地页。
6. 外链仅记录真实合作机会，不自动发送邮件、不购买链接、不批量生成垃圾链接。内容草稿需要事实核验后发布。

## 接下来四周

- 第 1 周：上线分享标签语言一致性、敏感页面 HTTP noindex，接通 GSC，建立技术与关键词基线。
- 第 2 周：依据曝光词优化空运和海运页，明确重量、体积重、附加费与更新日期。
- 第 3 周：从真实用户问题补 FAQ，建立首页 → 空运/海运 → FAQ 的相关链接。
- 第 4 周：比较两段完整 7 天和 28 天趋势，保留有效改动，决定是否新增城市页面。

## 数据与运行边界

不保证排名或收录时间。自动化目前可执行技术监测与报表更新；排名采集依赖 GSC 授权/导出。定时任务每次检查接入状态，条件未变化不反复索要授权。不会重设 Hermes 其他任务、覆盖其未提交工作、改广告隔离或写 Supabase 数据。

## 来源

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
