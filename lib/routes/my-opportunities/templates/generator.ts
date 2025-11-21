import type { JobItem } from '../services/fetcher';
import { escapeHtml, formatDate, truncateText } from '../utils/helpers';
import { extractSalary } from '../services/filter';

// 生成工作卡片HTML
export function generateJobCard(job: JobItem, index: number): string {
    const salary = extractSalary(`${job.title} ${job.meta}`);
    const salaryDisplay = salary > 0 ? `$${(salary / 1000).toFixed(0)}k` : '';
    
    return `
        <div class="job-item card-hover bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-4 mb-3" 
             data-source="${job.sourceName}" 
             data-region="${job.region || 'Global'}"
             data-content="${escapeHtml((job.title + ' ' + (job.description || '')).toLowerCase())}"
             data-salary="${salary}">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    ${job.sourceName}
                </span>
                <span class="text-xs text-gray-400">${job.region || 'Global'}</span>
            </div>
            <a href="${job.link}" target="_blank" class="block group">
                <h3 class="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2 leading-tight">
                    ${escapeHtml(job.title)}
                </h3>
                <div class="flex flex-wrap gap-2 items-center text-xs text-gray-500">
                    ${salaryDisplay ? `<span class="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">${salaryDisplay}</span>` : ''}
                    <span class="bg-gray-100 px-2 py-0.5 rounded">${job.author || 'Unknown'}</span>
                    <span class="text-gray-400">${formatDate(job.timestamp)}</span>
                    ${job.tags ? job.tags.slice(0, 3).map(tag => 
                        `<span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">#${tag}</span>`
                    ).join('') : ''}
                </div>
                ${job.description ? `<p class="text-xs text-gray-600 mt-2 line-clamp-2">${escapeHtml(truncateText(job.description))}</p>` : ''}
            </a>
        </div>
    `;
}

// 生成商机卡片HTML
export function generateIdeaCard(idea: JobItem, index: number): string {
    return `
        <div class="idea-item card-hover bg-gradient-to-r from-amber-50 to-white border border-amber-200 rounded-xl p-4 mb-3" 
             data-source="${idea.sourceName}" 
             data-region="${idea.region || 'Global'}"
             data-content="${escapeHtml((idea.title + ' ' + (idea.description || '')).toLowerCase())}">
            <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    ${idea.sourceName}
                </span>
                <span class="text-xs text-gray-400">${idea.region || 'Global'}</span>
            </div>
            <a href="${idea.link}" target="_blank" class="block group">
                <h3 class="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors mb-2 leading-tight">
                    ${escapeHtml(idea.title)}
                </h3>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                    <span class="bg-gray-100 px-2 py-0.5 rounded">${idea.author || 'Unknown'}</span>
                    <span class="text-gray-400">${formatDate(idea.timestamp)}</span>
                </div>
                ${idea.description ? `<p class="text-xs text-gray-600 mt-2 line-clamp-2">${escapeHtml(truncateText(idea.description))}</p>` : ''}
            </a>
        </div>
    `;
}

// 生成完整的HTML页面
export function generateHTML(
    highValueJobs: JobItem[],
    potentialIdeas: JobItem[],
    sourcesCount: number
): string {
    const jobCardsHTML = highValueJobs.slice(0, 100)
        .map((job, index) => generateJobCard(job, index))
        .join('');
    
    const ideaCardsHTML = potentialIdeas.slice(0, 100)
        .map((idea, index) => generateIdeaCard(idea, index))
        .join('');
    
    return getTemplate()
        .replace(/{{SOURCE_COUNT}}/g, sourcesCount.toString())
        .replace(/{{JOB_COUNT}}/g, highValueJobs.length.toString())
        .replace(/{{IDEA_COUNT}}/g, potentialIdeas.length.toString())
        .replace(/{{UPDATE_TIME}}/g, new Date().toLocaleString('zh-CN'))
        .replace('{{JOB_ITEMS}}', jobCardsHTML || '<div class="text-center text-gray-400 py-10">暂无匹配的高薪职位</div>')
        .replace('{{IDEA_ITEMS}}', ideaCardsHTML || '<div class="text-center text-gray-400 py-10">暂无商机信息</div>');
}

// 获取页面模板
function getTemplate(): string {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>全球高薪前端机会雷达 | $10k+ Monthly</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; height: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #888; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #555; }
        .card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .gradient-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .line-clamp-2 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    </style>
</head>
<body class="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold gradient-text">Global Opportunity Radar</h1>
                        <p class="text-xs text-gray-500">Frontend $10k+/month • Remote • 100+ Sources</p>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-database text-indigo-500 mr-1"></i>
                        <span class="font-semibold">{{SOURCE_COUNT}}</span> 数据源
                    </div>
                    <button onclick="window.location.reload()" class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                        <i class="fas fa-sync-alt mr-1"></i>刷新
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- Stats Bar -->
    <div class="bg-white/60 backdrop-blur-sm border-b border-gray-100">
        <div class="max-w-7xl mx-auto px-4 py-3">
            <div class="flex justify-center items-center space-x-6 text-sm">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-briefcase text-indigo-500"></i>
                    <span><strong>{{JOB_COUNT}}</strong> 个高薪职位</span>
                </div>
                <div class="text-gray-300">|</div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-lightbulb text-amber-500"></i>
                    <span><strong>{{IDEA_COUNT}}</strong> 个商机</span>
                </div>
                <div class="text-gray-300">|</div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-clock text-green-500"></i>
                    <span>更新时间: {{UPDATE_TIME}}</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Jobs Column -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-5">
                    <h2 class="text-xl font-bold text-white flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <i class="fas fa-briefcase"></i>
                            高薪远程前端职位
                        </span>
                        <span class="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                            {{JOB_COUNT}}
                        </span>
                    </h2>
                    <p class="text-indigo-100 text-sm mt-1">月薪 $10k+ • 全球远程 • 前端开发</p>
                </div>
                <div class="h-[70vh] overflow-y-auto scrollbar-thin p-4">
                    {{JOB_ITEMS}}
                </div>
            </div>

            <!-- Ideas Column -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-gradient-to-r from-amber-500 to-orange-600 p-5">
                    <h2 class="text-xl font-bold text-white flex items-center justify-between">
                        <span class="flex items-center gap-2">
                            <i class="fas fa-lightbulb"></i>
                            用户痛点 & 商机
                        </span>
                        <span class="bg-white/20 text-white text-sm px-3 py-1 rounded-full">
                            {{IDEA_COUNT}}
                        </span>
                    </h2>
                    <p class="text-amber-100 text-sm mt-1">发现需求 • 创造价值 • 付费意愿</p>
                </div>
                <div class="h-[70vh] overflow-y-auto scrollbar-thin p-4">
                    {{IDEA_ITEMS}}
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-white/60 backdrop-blur-sm border-t border-gray-200 mt-12 py-4">
        <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
            <p>💡 数据源包含：欧美远程平台 50+ | 中文社区 10+ | 创业平台 20+ | Web3平台 10+</p>
            <p class="mt-2 text-xs text-gray-500">
                Powered by RSSHub • 每10分钟自动更新 • 
                <a href="/my-opportunities/stats" class="text-indigo-600 hover:text-indigo-700">查看统计</a>
            </p>
        </div>
    </footer>
</body>
</html>`;
}
