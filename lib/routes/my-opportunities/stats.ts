import { Route } from '@/types';
import { getAllSources, getSourcesByRegion, getSourcesByType } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { filterItems, extractSalary } from './services/filter';
import { calculateStatistics } from './utils/helpers';
import { regions } from './config/keywords';

export const route: Route = {
    path: '/stats',
    categories: ['other'],
    example: '/my-opportunities/stats',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '机会雷达统计面板',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        // 获取所有数据源
        const sources = getAllSources();
        
        // 抓取数据（限制为10个源避免超时和栈溢出）
        const limitedSources = sources.slice(0, 10);
        const allItems = await fetchMultipleSources(limitedSources);
        
        // 筛选
        const { highValueJobs, potentialIdeas } = filterItems(allItems);
        
        // 计算统计数据
        const jobStats = calculateStatistics(highValueJobs);
        const ideaStats = calculateStatistics(potentialIdeas);
        
        // 计算薪资分布
        const salaryDistribution = calculateSalaryDistribution(highValueJobs);
        
        // 生成统计页面
        const html = generateStatsHTML({
            sources,
            allItems,
            highValueJobs,
            potentialIdeas,
            jobStats,
            ideaStats,
            salaryDistribution
        });
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        return ctx.body(html);
        
    } catch (error) {
        ctx.status(500);
        return ctx.body(`Error: ${(error as Error).message}`);
    }
}

function calculateSalaryDistribution(jobs: any[]) {
    const ranges = {
        '0-10k': 0,
        '10k-15k': 0,
        '15k-20k': 0,
        '20k-30k': 0,
        '30k+': 0
    };
    
    jobs.forEach(job => {
        const text = `${job.title} ${job.meta || ''}`;
        const salary = extractSalary(text) / 1000; // 转换为k
        
        if (salary > 0) {
            if (salary < 10) ranges['0-10k']++;
            else if (salary < 15) ranges['10k-15k']++;
            else if (salary < 20) ranges['15k-20k']++;
            else if (salary < 30) ranges['20k-30k']++;
            else ranges['30k+']++;
        }
    });
    
    return ranges;
}

function generateStatsHTML(data: any) {
    const { sources, allItems, highValueJobs, potentialIdeas, jobStats, ideaStats, salaryDistribution } = data;
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>机会雷达统计面板</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-7xl mx-auto p-6">
        <!-- Header -->
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">📊 机会雷达统计面板</h1>
            <p class="text-gray-600">实时数据分析 • ${new Date().toLocaleString('zh-CN')}</p>
        </header>

        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">数据源总数</span>
                    <i class="fas fa-database text-blue-500"></i>
                </div>
                <div class="text-3xl font-bold text-gray-900">${sources.length}</div>
                <div class="text-xs text-gray-500 mt-1">
                    工作: ${sources.filter(s => s.type === 'job').length} | 
                    商机: ${sources.filter(s => s.type === 'idea').length}
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">抓取数据量</span>
                    <i class="fas fa-download text-green-500"></i>
                </div>
                <div class="text-3xl font-bold text-gray-900">${allItems.length}</div>
                <div class="text-xs text-gray-500 mt-1">
                    成功率: ${Math.round((allItems.length / (sources.length * 10)) * 100)}%
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">高薪职位</span>
                    <i class="fas fa-briefcase text-indigo-500"></i>
                </div>
                <div class="text-3xl font-bold text-indigo-600">${highValueJobs.length}</div>
                <div class="text-xs text-gray-500 mt-1">
                    筛选率: ${Math.round((highValueJobs.length / allItems.length) * 100)}%
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-600">商机数量</span>
                    <i class="fas fa-lightbulb text-amber-500"></i>
                </div>
                <div class="text-3xl font-bold text-amber-600">${potentialIdeas.length}</div>
                <div class="text-xs text-gray-500 mt-1">
                    筛选率: ${Math.round((potentialIdeas.length / allItems.length) * 100)}%
                </div>
            </div>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- 薪资分布图 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">💰 薪资分布</h2>
                <canvas id="salaryChart"></canvas>
            </div>
            
            <!-- 地区分布图 -->
            <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">🌍 地区分布</h2>
                <canvas id="regionChart"></canvas>
            </div>
        </div>

        <!-- Top Sources Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div class="px-6 py-4 bg-gray-50 border-b">
                <h2 class="text-lg font-semibold text-gray-800">🏆 Top 数据源表现</h2>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据源</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地区</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据量</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">高薪职位</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${Object.entries(jobStats.bySource || {})
                            .sort((a, b) => (b[1] as number) - (a[1] as number))
                            .slice(0, 10)
                            .map(([source, count]) => {
                                const sourceInfo = sources.find(s => s.name === source);
                                return `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${source}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${sourceInfo?.region || 'Unknown'}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                                                ${sourceInfo?.type || 'job'}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">${count}</td>
                                    </tr>
                                `;
                            }).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Region Stats -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            ${Object.entries(regions).map(([key, info]) => {
                const count = jobStats.byRegion[key] || 0;
                return `
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-2xl mb-2">${info.emoji}</div>
                        <div class="text-sm text-gray-600">${info.label}</div>
                        <div class="text-xl font-bold text-gray-900 mt-1">${count}</div>
                    </div>
                `;
            }).join('')}
        </div>
    </div>

    <script>
        // 薪资分布图
        new Chart(document.getElementById('salaryChart'), {
            type: 'bar',
            data: {
                labels: ${JSON.stringify(Object.keys(salaryDistribution))},
                datasets: [{
                    label: '职位数量',
                    data: ${JSON.stringify(Object.values(salaryDistribution))},
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // 地区分布图
        new Chart(document.getElementById('regionChart'), {
            type: 'doughnut',
            data: {
                labels: ${JSON.stringify(Object.keys(jobStats.byRegion || {}))},
                datasets: [{
                    data: ${JSON.stringify(Object.values(jobStats.byRegion || {}))},
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(244, 63, 94, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                        'rgba(20, 184, 166, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    </script>
</body>
</html>`;
}
