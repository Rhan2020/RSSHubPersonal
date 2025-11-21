import { Route } from '@/types';
import { getAllSources } from './config/sources';

export const route: Route = {
    path: '/',
    categories: ['other'],
    example: '/my-opportunities/',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '机会雷达导航页',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    const sources = getAllSources();
    const jobSources = sources.filter(s => s.type === 'job').length;
    const ideaSources = sources.filter(s => s.type === 'idea').length;
    
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🌍 全球机会雷达系统导航</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
        <div class="max-w-6xl mx-auto p-6">
            <!-- Header -->
            <header class="text-center mb-12 pt-8">
                <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    🚀 全球机会雷达系统
                </h1>
                <p class="text-xl text-gray-600">高薪前端职位 & 商业机会监控平台</p>
                <div class="mt-6 flex justify-center gap-6 text-sm">
                    <span class="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full">
                        <i class="fas fa-database mr-2"></i>${sources.length} 数据源
                    </span>
                    <span class="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                        <i class="fas fa-briefcase mr-2"></i>${jobSources} 职位平台
                    </span>
                    <span class="bg-amber-100 text-amber-700 px-4 py-2 rounded-full">
                        <i class="fas fa-lightbulb mr-2"></i>${ideaSources} 商机渠道
                    </span>
                </div>
            </header>

            <!-- Main Routes -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <!-- Dashboard Route -->
                <a href="/my-opportunities/dashboard" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-indigo-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-tachometer-alt text-indigo-600 text-xl"></i>
                            </div>
                            <span class="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded">推荐</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-indigo-600">Dashboard</h3>
                        <p class="text-gray-600 text-sm mb-3">快速访问版本，使用缓存数据，加载速度最快</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-clock mr-1"></i>响应时间: ~1秒
                        </div>
                    </div>
                </a>

                <!-- Global Modular Route -->
                <a href="/my-opportunities/global-modular" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-purple-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-globe text-purple-600 text-xl"></i>
                            </div>
                            <span class="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded">完整版</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-purple-600">Global Modular</h3>
                        <p class="text-gray-600 text-sm mb-3">模块化架构，150+ 数据源，信息最全面</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-database mr-1"></i>数据源: 150+
                        </div>
                    </div>
                </a>

                <!-- API Route -->
                <a href="/my-opportunities/api?type=jobs&limit=10" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-green-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-code text-green-600 text-xl"></i>
                            </div>
                            <span class="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">开发者</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-green-600">API 接口</h3>
                        <p class="text-gray-600 text-sm mb-3">JSON 数据接口，支持参数筛选，便于集成</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-plug mr-1"></i>格式: JSON
                        </div>
                    </div>
                </a>

                <!-- Stats Route -->
                <a href="/my-opportunities/stats" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-amber-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-chart-bar text-amber-600 text-xl"></i>
                            </div>
                            <span class="bg-amber-100 text-amber-600 text-xs px-2 py-1 rounded">分析</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-amber-600">统计面板</h3>
                        <p class="text-gray-600 text-sm mb-3">数据分析仪表盘，查看薪资分布和趋势</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-chart-pie mr-1"></i>可视化图表
                        </div>
                    </div>
                </a>

                <!-- RSS Route -->
                <a href="/my-opportunities/rss" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-orange-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-rss text-orange-600 text-xl"></i>
                            </div>
                            <span class="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded">订阅</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-orange-600">RSS Feed</h3>
                        <p class="text-gray-600 text-sm mb-3">标准 RSS 输出，支持阅读器订阅</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-sync-alt mr-1"></i>自动更新
                        </div>
                    </div>
                </a>

                <!-- Filter Route -->
                <a href="/my-opportunities/filter" class="group">
                    <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1 border-t-4 border-blue-500">
                        <div class="flex items-center justify-between mb-4">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i class="fas fa-filter text-blue-600 text-xl"></i>
                            </div>
                            <span class="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">高级</span>
                        </div>
                        <h3 class="text-xl font-semibold mb-2 group-hover:text-blue-600">高级筛选</h3>
                        <p class="text-gray-600 text-sm mb-3">自定义筛选条件，精确匹配需求</p>
                        <div class="text-xs text-gray-500">
                            <i class="fas fa-sliders-h mr-1"></i>多维度筛选
                        </div>
                    </div>
                </a>
            </div>

            <!-- Other Routes -->
            <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 class="text-2xl font-semibold mb-4 text-gray-800">其他功能路由</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center">
                            <i class="fas fa-history text-gray-500 mr-3"></i>
                            <div>
                                <a href="/my-opportunities/global" class="text-gray-700 font-medium hover:text-indigo-600">
                                    /global
                                </a>
                                <p class="text-xs text-gray-500">旧版增强路由</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center">
                            <i class="fas fa-vial text-gray-500 mr-3"></i>
                            <div>
                                <a href="/my-opportunities/test" class="text-gray-700 font-medium hover:text-indigo-600">
                                    /test
                                </a>
                                <p class="text-xs text-gray-500">系统测试页面</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center">
                            <i class="fas fa-sync-alt text-gray-500 mr-3"></i>
                            <div>
                                <a href="/my-opportunities/realtime" class="text-gray-700 font-medium hover:text-indigo-600">
                                    /realtime
                                </a>
                                <p class="text-xs text-gray-500">实时监控（开发中）</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div class="flex items-center">
                            <i class="fas fa-bell text-gray-500 mr-3"></i>
                            <div>
                                <a href="/my-opportunities/alerts" class="text-gray-700 font-medium hover:text-indigo-600">
                                    /alerts
                                </a>
                                <p class="text-xs text-gray-500">机会提醒（开发中）</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- API Examples -->
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 text-white">
                <h2 class="text-2xl font-semibold mb-4">API 使用示例</h2>
                <div class="space-y-3 font-mono text-sm">
                    <div class="bg-gray-900 p-3 rounded">
                        <span class="text-green-400">GET</span> 
                        <span class="text-gray-300">/my-opportunities/api?type=jobs&limit=20</span>
                    </div>
                    <div class="bg-gray-900 p-3 rounded">
                        <span class="text-green-400">GET</span> 
                        <span class="text-gray-300">/my-opportunities/api?type=ideas&region=Global</span>
                    </div>
                    <div class="bg-gray-900 p-3 rounded">
                        <span class="text-green-400">GET</span> 
                        <span class="text-gray-300">/my-opportunities/api?region=CN&limit=50</span>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <footer class="text-center mt-12 pb-8 text-gray-600">
                <p class="mb-2">💼 150+ 全球数据源 • 🚀 智能筛选 • 📊 实时更新</p>
                <p class="text-sm">Powered by RSSHub • ${new Date().toLocaleString('zh-CN')}</p>
            </footer>
        </div>
    </body>
    </html>
    `;
    
    ctx.header('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}
