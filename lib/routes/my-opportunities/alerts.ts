import { Route } from '@/types';
import cache from '@/utils/cache';
import { fetchMultipleSourcesEnhanced } from './services/enhanced-fetcher';
import { filterItems, sortByDate } from './services/filter';
import { getHighPrioritySources } from './config/reliable-sources';

export const route: Route = {
    path: '/alerts',
    categories: ['other'],
    example: '/my-opportunities/alerts',
    parameters: {
        keywords: '自定义关键词，逗号分隔（可选）',
        minSalary: '最低薪资，单位k（可选，如 100 表示 $100k）',
        regions: '地区筛选，逗号分隔（可选，如 Global,CN,US）',
    },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '机会提醒 - 个性化推送',
    maintainers: ['opportunity-hunter'],
    handler,
    description: '根据自定义条件筛选高价值机会，支持关键词、薪资、地区等多维度过滤',
};

interface AlertConfig {
    keywords: string[];
    minSalary: number;
    regions: string[];
    excludeKeywords: string[];
}

async function handler(ctx: any) {
    // 解析用户配置
    const config: AlertConfig = {
        keywords:
            ctx.req
                .query('keywords')
                ?.split(',')
                .map((k: string) => k.trim().toLowerCase()) || [],
        minSalary: Number.parseInt(ctx.req.query('minSalary') || '0') * 1000,
        regions:
            ctx.req
                .query('regions')
                ?.split(',')
                .map((r: string) => r.trim()) || [],
        excludeKeywords:
            ctx.req
                .query('exclude')
                ?.split(',')
                .map((k: string) => k.trim().toLowerCase()) || [],
    };

    // 生成缓存键
    const configHash = JSON.stringify(config);
    const cacheKey = `alerts:${Buffer.from(configHash).toString('base64').slice(0, 20)}`;

    // 尝试从缓存获取
    const cached = await cache.get(cacheKey);
    if (cached) {
        return generateResponse(ctx, cached as any[], config);
    }

    // 获取高优先级数据源
    const sources = getHighPrioritySources();

    // 抓取数据
    const allItems = await fetchMultipleSourcesEnhanced(sources);

    // 基础筛选
    let { highValueJobs, potentialIdeas } = filterItems(allItems);

    // 应用用户自定义筛选
    if (config.keywords.length > 0) {
        highValueJobs = highValueJobs.filter((job) => {
            const text = `${job.title} ${job.description || ''}`.toLowerCase();
            return config.keywords.some((k) => text.includes(k));
        });
        potentialIdeas = potentialIdeas.filter((idea) => {
            const text = `${idea.title} ${idea.description || ''}`.toLowerCase();
            return config.keywords.some((k) => text.includes(k));
        });
    }

    // 排除关键词
    if (config.excludeKeywords.length > 0) {
        highValueJobs = highValueJobs.filter((job) => {
            const text = `${job.title} ${job.description || ''}`.toLowerCase();
            return !config.excludeKeywords.some((k) => text.includes(k));
        });
    }

    // 地区筛选
    if (config.regions.length > 0) {
        highValueJobs = highValueJobs.filter((job) => config.regions.includes(job.region) || config.regions.includes('Global'));
    }

    // 薪资筛选
    if (config.minSalary > 0) {
        highValueJobs = highValueJobs.filter((job) => {
            const salaryMatch = job.salary?.match(/\$?(\d+)k/i);
            if (salaryMatch) {
                const salary = Number.parseInt(salaryMatch[1]) * 1000;
                return salary >= config.minSalary;
            }
            return true; // 没有薪资信息的也保留
        });
    }

    // 按时间排序
    highValueJobs = sortByDate(highValueJobs, true);
    potentialIdeas = sortByDate(potentialIdeas, true);

    // 合并结果
    const alerts = {
        jobs: highValueJobs.slice(0, 50),
        ideas: potentialIdeas.slice(0, 30),
        totalJobs: highValueJobs.length,
        totalIdeas: potentialIdeas.length,
        config,
        generatedAt: new Date().toISOString(),
    };

    // 缓存结果（5分钟）
    await cache.set(cacheKey, alerts, 300);

    return generateResponse(ctx, alerts, config);
}

function generateResponse(ctx: any, alerts: any, config: AlertConfig) {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>机会提醒 | My Opportunities</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .card-hover { transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
    <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- 头部 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <i class="fas fa-bell text-white text-xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-800">机会提醒</h1>
                        <p class="text-sm text-gray-500">个性化机会推送</p>
                    </div>
                </div>
                <a href="/my-opportunities/nav" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-arrow-left mr-1"></i>返回导航
                </a>
            </div>

            <!-- 当前筛选条件 -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h3 class="text-sm font-semibold text-gray-600 mb-2">当前筛选条件</h3>
                <div class="flex flex-wrap gap-2">
                    ${config.keywords.length > 0 ? config.keywords.map((k) => `<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">${k}</span>`).join('') : '<span class="text-gray-400 text-xs">无关键词筛选</span>'}
                    ${config.minSalary > 0 ? `<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">≥$${config.minSalary / 1000}k</span>` : ''}
                    ${config.regions.length > 0 ? config.regions.map((r) => `<span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">${r}</span>`).join('') : ''}
                </div>
            </div>

            <!-- 自定义筛选表单 -->
            <form class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4" method="GET">
                <div>
                    <label class="block text-xs text-gray-500 mb-1">关键词（逗号分隔）</label>
                    <input type="text" name="keywords" value="${config.keywords.join(',')}"
                           class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="react,vue,frontend">
                </div>
                <div>
                    <label class="block text-xs text-gray-500 mb-1">最低年薪（k）</label>
                    <input type="number" name="minSalary" value="${config.minSalary / 1000 || ''}"
                           class="w-full border rounded-lg px-3 py-2 text-sm" placeholder="100">
                </div>
                <div>
                    <label class="block text-xs text-gray-500 mb-1">地区</label>
                    <select name="regions" class="w-full border rounded-lg px-3 py-2 text-sm">
                        <option value="">全部</option>
                        <option value="Global" ${config.regions.includes('Global') ? 'selected' : ''}>全球</option>
                        <option value="CN" ${config.regions.includes('CN') ? 'selected' : ''}>中国</option>
                        <option value="US" ${config.regions.includes('US') ? 'selected' : ''}>美国</option>
                        <option value="EU" ${config.regions.includes('EU') ? 'selected' : ''}>欧洲</option>
                    </select>
                </div>
                <div class="flex items-end">
                    <button type="submit" class="w-full bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700">
                        <i class="fas fa-search mr-1"></i>筛选
                    </button>
                </div>
            </form>
        </div>

        <!-- 统计 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-xl shadow p-4 text-center">
                <div class="text-2xl font-bold text-blue-600">${alerts.totalJobs}</div>
                <div class="text-xs text-gray-500">匹配职位</div>
            </div>
            <div class="bg-white rounded-xl shadow p-4 text-center">
                <div class="text-2xl font-bold text-amber-600">${alerts.totalIdeas}</div>
                <div class="text-xs text-gray-500">商机线索</div>
            </div>
            <div class="bg-white rounded-xl shadow p-4 text-center">
                <div class="text-2xl font-bold text-green-600">${alerts.jobs.filter((j: any) => j.salary).length}</div>
                <div class="text-xs text-gray-500">有薪资信息</div>
            </div>
            <div class="bg-white rounded-xl shadow p-4 text-center">
                <div class="text-2xl font-bold text-purple-600">${new Set(alerts.jobs.map((j: any) => j.sourceName)).size}</div>
                <div class="text-xs text-gray-500">数据源</div>
            </div>
        </div>

        <!-- 职位列表 -->
        <div class="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-briefcase text-blue-500"></i>
                匹配的职位 (${alerts.jobs.length})
            </h2>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${
                    alerts.jobs.length > 0
                        ? alerts.jobs
                              .map(
                                  (job: any) => `
                    <a href="${job.link}" target="_blank" class="block card-hover bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">${job.sourceName}</span>
                            ${job.salary ? `<span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">${job.salary}</span>` : ''}
                        </div>
                        <h3 class="font-medium text-gray-800 mb-1 line-clamp-1">${escapeHtml(job.title)}</h3>
                        <p class="text-xs text-gray-500">${job.author || 'Unknown'} • ${job.region}</p>
                    </a>
                `
                              )
                              .join('')
                        : '<div class="text-center text-gray-400 py-8">暂无匹配的职位</div>'
                }
            </div>
        </div>

        <!-- 商机列表 -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-lightbulb text-amber-500"></i>
                商机线索 (${alerts.ideas.length})
            </h2>
            <div class="space-y-3 max-h-96 overflow-y-auto">
                ${
                    alerts.ideas.length > 0
                        ? alerts.ideas
                              .map(
                                  (idea: any) => `
                    <a href="${idea.link}" target="_blank" class="block card-hover bg-amber-50 rounded-lg p-4 border border-amber-100">
                        <div class="flex justify-between items-start mb-2">
                            <span class="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">${idea.sourceName}</span>
                            <span class="text-xs text-gray-400">${idea.region}</span>
                        </div>
                        <h3 class="font-medium text-gray-800 mb-1 line-clamp-2">${escapeHtml(idea.title)}</h3>
                    </a>
                `
                              )
                              .join('')
                        : '<div class="text-center text-gray-400 py-8">暂无商机线索</div>'
                }
            </div>
        </div>

        <!-- 页脚 -->
        <div class="text-center text-xs text-gray-400 mt-6">
            生成时间: ${alerts.generatedAt} |
            <a href="/my-opportunities/rss?keywords=${config.keywords.join(',')}" class="text-blue-500 hover:underline">
                <i class="fas fa-rss mr-1"></i>订阅 RSS
            </a>
        </div>
    </div>
</body>
</html>`;

    ctx.set('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}

function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replaceAll(/[&<>"']/g, (m) => map[m]);
}
