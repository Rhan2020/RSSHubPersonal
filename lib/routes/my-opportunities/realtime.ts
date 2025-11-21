import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { filterItems, deduplicateItems, sortByDate } from './services/filter';
import type { JobItem } from './services/fetcher';

export const route: Route = {
    path: '/realtime',
    categories: ['other'],
    example: '/my-opportunities/realtime',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '实时监控面板',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        // 获取少量数据源进行实时展示
        const sources = getAllSources().filter(s => 
            s.name.includes('V2EX') || 
            s.name.includes('RemoteOK') || 
            s.name.includes('电鸭') ||
            s.name.includes('Reddit')
        ).slice(0, 10);
        
        const allItems = await fetchMultipleSources(sources);
        const uniqueItems = deduplicateItems(allItems);
        const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
        
        // 获取最新的10条数据
        const latestJobs = sortByDate(highValueJobs.length > 0 ? highValueJobs : allItems.filter(item => item.type === 'job'), true).slice(0, 10);
        const latestIdeas = sortByDate(potentialIdeas.length > 0 ? potentialIdeas : allItems.filter(item => item.type === 'idea'), true).slice(0, 10);
        
        const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>实时监控 - 全球机会雷达</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <meta http-equiv="refresh" content="300"> <!-- 5分钟自动刷新 -->
    </head>
    <body class="bg-gray-900 text-white">
        <div class="min-h-screen p-4">
            <!-- Header -->
            <header class="mb-6">
                <div class="max-w-7xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <h1 class="text-2xl font-bold">实时监控中心</h1>
                        <span class="text-sm text-gray-400">每5分钟自动更新</span>
                    </div>
                    <div class="text-sm text-gray-400">
                        最后更新: ${new Date().toLocaleTimeString('zh-CN')}
                    </div>
                </div>
            </header>

            <!-- Stats Bar -->
            <div class="max-w-7xl mx-auto mb-6">
                <div class="grid grid-cols-4 gap-4">
                    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div class="text-gray-400 text-xs mb-1">活跃数据源</div>
                        <div class="text-2xl font-bold text-green-400">${sources.length}</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div class="text-gray-400 text-xs mb-1">新增职位</div>
                        <div class="text-2xl font-bold text-blue-400">${highValueJobs.length}</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div class="text-gray-400 text-xs mb-1">新增商机</div>
                        <div class="text-2xl font-bold text-amber-400">${potentialIdeas.length}</div>
                    </div>
                    <div class="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div class="text-gray-400 text-xs mb-1">总数据量</div>
                        <div class="text-2xl font-bold text-purple-400">${allItems.length}</div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Latest Jobs -->
                <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-700">
                        <h2 class="text-lg font-semibold flex items-center justify-between">
                            <span><i class="fas fa-briefcase mr-2"></i>最新职位</span>
                            <span class="text-xs bg-blue-800 px-2 py-1 rounded">${latestJobs.length} 条</span>
                        </h2>
                    </div>
                    <div class="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        ${latestJobs.map(job => `
                            <div class="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                                <div class="flex items-start justify-between mb-2">
                                    <a href="${job.link}" target="_blank" class="flex-1 hover:text-blue-400 transition-colors">
                                        <h3 class="font-medium text-sm line-clamp-2">${job.title}</h3>
                                    </a>
                                    <span class="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                        ${new Date(job.timestamp).toLocaleString('zh-CN')}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3 text-xs text-gray-400">
                                    <span><i class="fas fa-building mr-1"></i>${job.sourceName}</span>
                                    <span><i class="fas fa-globe mr-1"></i>${job.region}</span>
                                </div>
                            </div>
                        `).join('')}
                        ${latestJobs.length === 0 ? '<div class="text-center text-gray-500 py-8">暂无数据</div>' : ''}
                    </div>
                </div>

                <!-- Latest Ideas -->
                <div class="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                    <div class="p-4 bg-gradient-to-r from-amber-600 to-amber-700">
                        <h2 class="text-lg font-semibold flex items-center justify-between">
                            <span><i class="fas fa-lightbulb mr-2"></i>最新商机</span>
                            <span class="text-xs bg-amber-800 px-2 py-1 rounded">${latestIdeas.length} 条</span>
                        </h2>
                    </div>
                    <div class="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                        ${latestIdeas.map(idea => `
                            <div class="bg-gray-900 rounded-lg p-3 hover:bg-gray-700 transition-colors">
                                <div class="flex items-start justify-between mb-2">
                                    <a href="${idea.link}" target="_blank" class="flex-1 hover:text-amber-400 transition-colors">
                                        <h3 class="font-medium text-sm line-clamp-2">${idea.title}</h3>
                                    </a>
                                    <span class="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                        ${new Date(idea.timestamp).toLocaleString('zh-CN')}
                                    </span>
                                </div>
                                <div class="flex items-center gap-3 text-xs text-gray-400">
                                    <span><i class="fas fa-user mr-1"></i>${idea.author}</span>
                                    <span><i class="fas fa-tag mr-1"></i>${idea.sourceName}</span>
                                </div>
                            </div>
                        `).join('')}
                        ${latestIdeas.length === 0 ? '<div class="text-center text-gray-500 py-8">暂无数据</div>' : ''}
                    </div>
                </div>
            </div>

            <!-- Activity Timeline -->
            <div class="max-w-7xl mx-auto mt-6">
                <div class="bg-gray-800 rounded-xl border border-gray-700 p-6">
                    <h2 class="text-lg font-semibold mb-4">
                        <i class="fas fa-stream mr-2"></i>实时数据流
                    </h2>
                    <div class="space-y-2 max-h-[300px] overflow-y-auto">
                        ${[...latestJobs.slice(0, 5), ...latestIdeas.slice(0, 5)]
                            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                            .map(item => `
                                <div class="flex items-center space-x-3 py-2 border-b border-gray-700">
                                    <div class="w-2 h-2 ${item.type === 'job' ? 'bg-blue-400' : 'bg-amber-400'} rounded-full"></div>
                                    <span class="text-xs text-gray-500 w-16">${new Date(item.timestamp).toLocaleString('zh-CN')}</span>
                                    <span class="text-xs ${item.type === 'job' ? 'text-blue-400' : 'text-amber-400'} w-12">
                                        ${item.type === 'job' ? '职位' : '商机'}
                                    </span>
                                    <a href="${item.link}" target="_blank" class="flex-1 text-sm hover:text-white transition-colors text-gray-300 truncate">
                                        ${item.title}
                                    </a>
                                    <span class="text-xs text-gray-500">${item.sourceName}</span>
                                </div>
                            `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <script>
            function formatTimeAgo(timestamp) {
                const date = new Date(timestamp);
                const now = new Date();
                const diff = now - date;
                const minutes = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                
                if (minutes < 1) return '刚刚';
                if (minutes < 60) return minutes + '分钟前';
                if (hours < 24) return hours + '小时前';
                return days + '天前';
            }
            
            // 每5分钟自动刷新页面
            setTimeout(() => {
                window.location.reload();
            }, 300000);
        </script>
        </body>
        </html>
        `;
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        ctx.header('Cache-Control', 'max-age=60'); // 缓存1分钟
        return html;
    } catch (error) {
        console.error('Realtime monitoring error:', error);
        
        // 返回友好的错误页面
        const errorHtml = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>实时监控 - 错误</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-900 text-white flex items-center justify-center min-h-screen">
            <div class="text-center p-8 bg-gray-800 rounded-lg shadow-lg max-w-md border border-gray-700">
                <div class="text-6xl mb-4">😔</div>
                <h1 class="text-2xl font-bold mb-2">实时监控加载失败</h1>
                <p class="text-gray-400 mb-6">数据暂时无法获取，请稍后重试</p>
                <div class="space-y-3">
                    <a href="/my-opportunities/realtime" class="block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        刷新重试
                    </a>
                    <a href="/my-opportunities" class="block px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600">
                        返回导航页
                    </a>
                </div>
                <p class="text-xs text-gray-500 mt-4">错误: ${(error as Error).message || '未知错误'}</p>
            </div>
        </body>
        </html>
        `;
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        return errorHtml;
    }
}

function formatTimeAgo(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return `${days}天前`;
}
