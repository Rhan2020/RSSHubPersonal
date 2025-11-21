import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchSourceEnhanced } from './services/enhanced-fetcher';
import { filterItems, deduplicateItems, sortByDate } from './services/filter';
import type { JobItem } from './services/fetcher';

export const route: Route = {
    path: '/test-enhanced',
    categories: ['other'],
    example: '/my-opportunities/test-enhanced',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '增强版国外源测试',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    // 选择重点国外远程工作平台
    const sources = getAllSources();
    const testSources = sources.filter(s => 
        s.name.includes('RemoteOK') ||
        s.name.includes('We Work Remotely') ||
        s.name.includes('FlexJobs') ||
        s.name.includes('Remote.co') ||
        s.name.includes('JustRemote') ||
        s.name.includes('Remotive')
    ).slice(0, 6); // 测试6个主要平台
    
    interface TestResult {
        name: string;
        url: string;
        status: string;
        itemCount: number;
        responseTime: string;
        error?: string;
        sampleJobs: Array<{title: string; company: string; salary?: string}>;
    }
    
    const results: TestResult[] = [];
    let totalItems: JobItem[] = [];
    
    // 逐个测试数据源
    for (const source of testSources) {
        console.log(`正在测试增强版: ${source.name}...`);
        const startTime = Date.now();
        
        try {
            const items = await fetchSourceEnhanced(source);
            const endTime = Date.now();
            
            if (items.length > 0) {
                totalItems = totalItems.concat(items);
                
                results.push({
                    name: source.name,
                    url: source.url,
                    status: '✅ 成功',
                    itemCount: items.length,
                    responseTime: `${endTime - startTime}ms`,
                    sampleJobs: items.slice(0, 3).map(item => ({
                        title: item.title,
                        company: item.author,
                        salary: item.salary
                    }))
                });
                
                console.log(`✅ ${source.name}: 获取 ${items.length} 条数据`);
            } else {
                results.push({
                    name: source.name,
                    url: source.url,
                    status: '⚠️ 无数据',
                    itemCount: 0,
                    responseTime: `${endTime - startTime}ms`,
                    sampleJobs: []
                });
                console.log(`⚠️ ${source.name}: 无数据返回`);
            }
        } catch (error) {
            const endTime = Date.now();
            results.push({
                name: source.name,
                url: source.url,
                status: '❌ 失败',
                error: (error as Error).message,
                itemCount: 0,
                responseTime: `${endTime - startTime}ms`,
                sampleJobs: []
            });
            console.log(`❌ ${source.name}: ${(error as Error).message}`);
        }
    }
    
    // 对获取的数据进行去重和筛选
    const uniqueItems = deduplicateItems(totalItems);
    const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
    const sortedJobs = sortByDate(highValueJobs, true).slice(0, 20);
    
    // 生成测试报告HTML
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>国外远程工作数据源测试 - 增强版</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-8">
        <div class="max-w-7xl mx-auto">
            <!-- Header -->
            <header class="mb-8 text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-2">🚀 国外远程工作数据源测试</h1>
                <p class="text-lg text-gray-600">增强版爬虫引擎 v2.0</p>
                <p class="text-sm text-gray-500">测试时间：${new Date().toLocaleString('zh-CN')}</p>
            </header>
            
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">测试平台</p>
                            <p class="text-2xl font-bold text-blue-600">${testSources.length}</p>
                        </div>
                        <i class="fas fa-globe text-3xl text-blue-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">成功率</p>
                            <p class="text-2xl font-bold text-green-600">
                                ${Math.round(results.filter(r => r.itemCount > 0).length / results.length * 100)}%
                            </p>
                        </div>
                        <i class="fas fa-check-circle text-3xl text-green-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">总职位数</p>
                            <p class="text-2xl font-bold text-purple-600">${totalItems.length}</p>
                        </div>
                        <i class="fas fa-briefcase text-3xl text-purple-400"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">高薪职位</p>
                            <p class="text-2xl font-bold text-amber-600">${highValueJobs.length}</p>
                        </div>
                        <i class="fas fa-dollar-sign text-3xl text-amber-400"></i>
                    </div>
                </div>
            </div>
            
            <!-- Test Results -->
            <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div class="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
                    <h2 class="text-xl font-semibold">平台测试结果</h2>
                </div>
                <div class="p-6">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left py-3 px-4">平台名称</th>
                                <th class="text-left py-3 px-4">状态</th>
                                <th class="text-left py-3 px-4">获取数量</th>
                                <th class="text-left py-3 px-4">响应时间</th>
                                <th class="text-left py-3 px-4">示例职位</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(result => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4">
                                        <div>
                                            <div class="font-semibold">${result.name}</div>
                                            <div class="text-xs text-gray-500 truncate max-w-xs" title="${result.url}">${result.url}</div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="${result.status.includes('✅') ? 'text-green-600' : result.status.includes('⚠️') ? 'text-yellow-600' : 'text-red-600'}">
                                            ${result.status}
                                        </span>
                                        ${result.error ? `<div class="text-xs text-red-500 mt-1">${result.error}</div>` : ''}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="${result.itemCount > 0 ? 'font-bold text-blue-600' : 'text-gray-400'}">
                                            ${result.itemCount}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">
                                        ${result.responseTime}
                                    </td>
                                    <td class="py-3 px-4">
                                        ${result.sampleJobs.length > 0 ? `
                                            <div class="text-xs space-y-1">
                                                ${result.sampleJobs.map(job => `
                                                    <div class="border-l-2 border-blue-400 pl-2">
                                                        <div class="font-medium truncate">${job.title}</div>
                                                        <div class="text-gray-500">${job.company} ${job.salary ? `• ${job.salary}` : ''}</div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : '<span class="text-gray-400 text-xs">无数据</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- High Value Jobs -->
            ${sortedJobs.length > 0 ? `
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
                        <h2 class="text-xl font-semibold">🔥 最新高薪远程职位</h2>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${sortedJobs.map(job => `
                                <div class="border-l-4 border-green-500 pl-4 py-3 hover:bg-gray-50">
                                    <a href="${job.link}" target="_blank" class="block">
                                        <h3 class="font-semibold text-gray-900 hover:text-blue-600">${job.title}</h3>
                                        <div class="text-sm text-gray-600 mt-1">
                                            <span class="mr-3"><i class="fas fa-building mr-1"></i>${job.author}</span>
                                            ${job.salary ? `<span class="text-green-600 font-semibold">${job.salary}</span>` : ''}
                                        </div>
                                        ${job.description ? `<p class="text-sm text-gray-500 mt-2">${job.description.substring(0, 100)}...</p>` : ''}
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    </body>
    </html>
    `;
    
    ctx.header('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}
