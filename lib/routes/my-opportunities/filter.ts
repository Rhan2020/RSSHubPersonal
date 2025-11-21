import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { advancedFilter, sortBySalary, sortByDate, deduplicateItems } from './services/filter';
import { generateHTML } from './templates/generator';
import { regions } from './config/keywords';

export const route: Route = {
    path: '/filter',
    categories: ['other'],
    example: '/my-opportunities/filter',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '高级筛选界面',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>高级筛选 - 全球机会雷达</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-gray-50">
        <div class="max-w-7xl mx-auto p-6">
            <!-- Header -->
            <header class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">🎯 高级筛选器</h1>
                        <p class="text-gray-600 mt-2">自定义条件，精准匹配您的需求</p>
                    </div>
                    <a href="/my-opportunities" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        <i class="fas fa-home mr-2"></i>返回导航
                    </a>
                </div>
            </header>

            <!-- Filter Form -->
            <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                <form id="filterForm" class="space-y-6">
                    <!-- Type Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-list mr-2"></i>数据类型
                        </label>
                        <div class="grid grid-cols-3 gap-3">
                            <label class="relative flex items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="type" value="all" checked class="sr-only peer">
                                <div class="text-center peer-checked:text-indigo-600 peer-checked:font-semibold">
                                    <i class="fas fa-globe mb-1 block"></i>
                                    全部
                                </div>
                                <div class="absolute inset-0 border-2 border-indigo-600 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                            </label>
                            <label class="relative flex items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="type" value="jobs" class="sr-only peer">
                                <div class="text-center peer-checked:text-indigo-600 peer-checked:font-semibold">
                                    <i class="fas fa-briefcase mb-1 block"></i>
                                    职位
                                </div>
                                <div class="absolute inset-0 border-2 border-indigo-600 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                            </label>
                            <label class="relative flex items-center justify-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="type" value="ideas" class="sr-only peer">
                                <div class="text-center peer-checked:text-indigo-600 peer-checked:font-semibold">
                                    <i class="fas fa-lightbulb mb-1 block"></i>
                                    商机
                                </div>
                                <div class="absolute inset-0 border-2 border-indigo-600 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                            </label>
                        </div>
                    </div>

                    <!-- Region Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-globe-americas mr-2"></i>地区
                        </label>
                        <div class="grid grid-cols-3 md:grid-cols-6 gap-3">
                            ${Object.entries(regions).map(([key, info]) => `
                                <label class="relative flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="regions" value="${key}" class="sr-only peer">
                                    <span class="text-2xl mb-1">${info.emoji}</span>
                                    <span class="text-xs peer-checked:text-indigo-600 peer-checked:font-semibold">${info.label.replace(info.emoji, '').trim()}</span>
                                    <div class="absolute inset-0 border-2 border-indigo-600 rounded-lg opacity-0 peer-checked:opacity-100 pointer-events-none"></div>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Salary Range -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-dollar-sign mr-2"></i>薪资范围（月薪）
                        </label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">最低薪资</label>
                                <input type="number" name="minSalary" placeholder="10000" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">最高薪资</label>
                                <input type="number" name="maxSalary" placeholder="50000" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            </div>
                        </div>
                    </div>

                    <!-- Keywords -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-key mr-2"></i>关键词
                        </label>
                        <input type="text" name="keywords" placeholder="React, TypeScript, Senior, Remote..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <p class="text-xs text-gray-500 mt-1">多个关键词用逗号分隔</p>
                    </div>

                    <!-- Exclude Keywords -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-minus-circle mr-2"></i>排除关键词
                        </label>
                        <input type="text" name="excludeKeywords" placeholder="Junior, Intern, Entry-level..." 
                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <p class="text-xs text-gray-500 mt-1">排除包含这些关键词的结果</p>
                    </div>

                    <!-- Source Selection -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-database mr-2"></i>数据源类别
                        </label>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <label class="flex items-center">
                                <input type="checkbox" name="sourceCategory" value="traditional" checked class="mr-2">
                                <span class="text-sm">传统招聘平台</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="sourceCategory" value="social" checked class="mr-2">
                                <span class="text-sm">社交媒体</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="sourceCategory" value="crypto" class="mr-2">
                                <span class="text-sm">Web3/Crypto</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" name="sourceCategory" value="startup" class="mr-2">
                                <span class="text-sm">创业平台</span>
                            </label>
                        </div>
                    </div>

                    <!-- Sort Options -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            <i class="fas fa-sort mr-2"></i>排序方式
                        </label>
                        <select name="sortBy" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="date">按时间排序（最新优先）</option>
                            <option value="salary">按薪资排序（最高优先）</option>
                            <option value="relevance">按相关性排序</option>
                        </select>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-center pt-4">
                        <button type="submit" class="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                            <i class="fas fa-search mr-2"></i>开始筛选
                        </button>
                    </div>
                </form>
            </div>

            <!-- Results Container -->
            <div id="resultsContainer" class="hidden">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h2 class="text-xl font-semibold mb-4">筛选结果</h2>
                    <div id="results" class="space-y-4">
                        <!-- Results will be inserted here -->
                    </div>
                </div>
            </div>
        </div>

        <script>
            document.getElementById('filterForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const params = new URLSearchParams();
                
                // Build query params
                params.append('type', formData.get('type'));
                
                const regions = formData.getAll('regions');
                if (regions.length > 0) {
                    params.append('regions', regions.join(','));
                }
                
                if (formData.get('minSalary')) {
                    params.append('minSalary', formData.get('minSalary'));
                }
                if (formData.get('maxSalary')) {
                    params.append('maxSalary', formData.get('maxSalary'));
                }
                if (formData.get('keywords')) {
                    params.append('keywords', formData.get('keywords'));
                }
                if (formData.get('excludeKeywords')) {
                    params.append('excludeKeywords', formData.get('excludeKeywords'));
                }
                
                params.append('sortBy', formData.get('sortBy'));
                
                // Show loading state
                document.getElementById('resultsContainer').classList.remove('hidden');
                document.getElementById('results').innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i><p class="mt-4 text-gray-600">正在筛选数据...</p></div>';
                
                try {
                    // Fetch filtered data
                    const response = await fetch('/my-opportunities/api?' + params.toString());
                    const data = await response.json();
                    
                    // Display results
                    if (data.success && data.data.length > 0) {
                        const resultsHTML = data.data.map(item => \`
                            <div class="border-l-4 border-indigo-500 pl-4 py-3">
                                <a href="\${item.link}" target="_blank" class="hover:text-indigo-600">
                                    <h3 class="font-semibold">\${item.title}</h3>
                                    <div class="text-sm text-gray-600 mt-1">
                                        <span class="mr-3"><i class="fas fa-map-marker-alt mr-1"></i>\${item.region}</span>
                                        <span class="mr-3"><i class="fas fa-building mr-1"></i>\${item.source}</span>
                                        \${item.salary ? \`<span class="text-green-600 font-semibold">$\${Math.round(item.salary/1000)}k/月</span>\` : ''}
                                    </div>
                                    \${item.description ? \`<p class="text-sm text-gray-500 mt-2">\${item.description.substring(0, 150)}...</p>\` : ''}
                                </a>
                            </div>
                        \`).join('');
                        
                        document.getElementById('results').innerHTML = resultsHTML;
                    } else {
                        document.getElementById('results').innerHTML = '<p class="text-center text-gray-500 py-8">没有找到符合条件的结果</p>';
                    }
                } catch (error) {
                    document.getElementById('results').innerHTML = '<p class="text-center text-red-500 py-8">筛选失败，请重试</p>';
                }
            });
        </script>
    </body>
    </html>
    `;
    
    ctx.header('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}
