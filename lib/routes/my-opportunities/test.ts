import { Route } from '@/types';

// 测试路由 - 用于验证系统是否正常工作
export const route: Route = {
    path: '/test',
    categories: ['other'],
    example: '/my-opportunities/test',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '系统测试页面',
    maintainers: ['frontend-hunter'],
    handler,
};

async function handler(ctx) {
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>系统测试页面</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 p-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-3xl font-bold mb-6">🚀 全球机会雷达系统测试</h1>
            
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">✅ 系统状态</h2>
                <p class="text-green-600">系统正常运行！</p>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6 mb-6">
                <h2 class="text-xl font-semibold mb-4">📍 可用路由</h2>
                <ul class="space-y-2">
                    <li>
                        <a href="/my-opportunities/dashboard" class="text-blue-600 hover:underline">
                            /dashboard - 原始增强版（快速）
                        </a>
                    </li>
                    <li>
                        <a href="/my-opportunities/global" class="text-blue-600 hover:underline">
                            /global - 旧版增强（中速）
                        </a>
                    </li>
                    <li>
                        <a href="/my-opportunities/global-modular" class="text-blue-600 hover:underline">
                            /global-modular - 模块化版本（150+ 数据源）
                        </a>
                    </li>
                    <li>
                        <a href="/my-opportunities/stats" class="text-blue-600 hover:underline">
                            /stats - 统计面板
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-4">📊 系统信息</h2>
                <ul class="space-y-1 text-sm">
                    <li>数据源总数: 150+</li>
                    <li>传统平台: 100+</li>
                    <li>社交媒体: 50+</li>
                    <li>缓存时间: 10分钟</li>
                    <li>当前时间: ${new Date().toLocaleString('zh-CN')}</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;
    
    ctx.header('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}
