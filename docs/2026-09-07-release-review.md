# 2026-09-07 优化与发布记录

## 本轮实际完成

- 更新现有私牌采购指南与 25 bar 采购核验指南，保留网址和原有型号图片。每篇增加直接答案、目标关键词、内链，并完善为 6 个真实 FAQ。
- 私牌指南聚焦美国采购流程；参数指南聚焦如何核验规格，避免两个页面争夺相同搜索意图。
- 显示真实更新日期，缩短私牌指南标题，修正深色背景上文章日期信息对比度不足。
- 客户批量分配采用短事务和事务级锁；分配与逐客户审计一起提交，失败一起回滚。重复调用不会重新分配已有负责人。排除测试、已成交和无效客户。
- 客户负责人历史兼容增加一次性初始化标记：历史缺失值可从最近有效询盘恢复，管理员主动清空后不会因服务重启再次恢复。
- 客户档案成为负责人主记录：同邮箱询盘立即同步，聊天数据库采用持久化待同步状态与自动重试；跨数据库失败不再静默，后台会显示“负责人同步待重试”。
- 增加一次性历史副本核对，修复新同步机制上线前已存在的询盘或聊天负责人差异。
- 未操作真实客户分配，未发送客户邮件，未公开价格，未修改产品型号、图片和参数。

## 文件

- lib/buyer-guides.ts
- app/resources/[slug]/page.tsx
- app/styles/upgrade.css
- lib/customer-assignment.ts
- lib/customer-service.ts
- lib/customer-owner-backfill.ts
- lib/customer-owner-sync.ts
- app/api/admin/customers/route.ts
- scripts/verify-customer-assignment.mjs
- tests/rendered-html.test.mjs
- tests/e2e/buyer-guides.spec.ts

## 验证与发布

- npm test：36/36。
- lint、TypeScript、生产构建：通过。
- 数据库隔离临时表：3 组场景通过，验证均衡、重复调用、排除条件和逐客户审计；没有改动 public CRM 数据。尚未做并发压力测试或故障注入测试。
- 本地浏览器：6 项导航/美国批发/后台登录检查通过；4 项采购指南检查通过，覆盖桌面与手机。
- 线上浏览器：4 项采购指南检查通过，覆盖 FAQ 展开、图片加载、无横向溢出、更新日期、BlogPosting/FAQPage 和页面脚本异常。
- 本地及线上 SEO 审查：44 个 sitemap URL 通过基础检查（标题、描述、canonical、H1、noindex、重复标题）。这不是完整外部搜索引擎认证。
- Vercel：READY，生产提交 5731d89，部署 dpl_81TPG6Cn4VXtHDowWVMKPwb1bYHf。主域名与 www 已指向新部署。
- 最近 10 分钟部署错误日志查询没有返回日志；不等于已经完成长期监控。
- IndexNow：HTTP 200，接受 44 个 URL；不保证收录、排名或 AI 引用。

## 线上入口

- https://portablecoffeemachine.com/resources/portable-espresso-machine-private-label-buying-guide
- https://portablecoffeemachine.com/resources/25-bar-portable-coffee-machine-buying-checklist
- https://portablecoffeemachine.com/admin/customers

## 仍需继续，不能算全部完成

1. 本轮没有重新验证所有后台增删改查、邮件送达、聊天翻译或全部语言页面。下一轮应逐流程回归，避免用本轮通过代表全站零漏洞。
2. 需要 GA4 / Search Console 最近 28 天的真实数据或只读访问，才能判断自然流量、美国访客、有效询盘和页面转化，不能仅凭发布内容声称已获客。
3. 真实客户反馈、包装 Logo 和质检照片可继续补充；新增证据须确认允许公开及适用型号。
4. 构建出现可选 WASM 依赖的 peer dependency 警告，未阻塞构建；后续单独评估依赖升级，不在本轮盲目升级。
