// 主路由导出 - RSSHub 会自动扫描并注册所有导出的路由

// 导出所有路由，使它们都能被访问
export { route as navRoute } from './nav'; // 导航页 /
export { route as dashboardRoute } from './enhanced'; // 仪表盘 /dashboard
export { route as globalRoute } from './global'; // 模块化版 /global-modular
export { route as statsRoute } from './stats'; // 统计面板 /stats
export { route as apiRoute } from './api'; // API接口 /api
export { route as rssRoute } from './rss'; // RSS订阅 /rss
export { route as filterRoute } from './filter'; // 高级筛选 /filter
export { route as testRoute } from './test'; // 测试页面 /test
export { route as realtimeRoute } from './realtime'; // 实时监控 /realtime
export { route as sourceTestRoute } from './source-test'; // 数据源测试 /source-test
export { route as testEnhancedRoute } from './test-enhanced'; // 增强版测试 /test-enhanced
export { route as alertsRoute } from './alerts'; // 机会提醒 /alerts

// 默认路由（使用导航页）
export { route } from './nav';
