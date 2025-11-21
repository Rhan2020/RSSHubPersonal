import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchSource } from './services/fetcher';
import cache from '@/utils/cache';

export const route: Route = {
    path: '/source-test',
    categories: ['other'],
    example: '/my-opportunities/source-test',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '数据源测试',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    // 获取所有远程工作相关的数据源
    const sources = getAllSources();
    const remoteSources = sources.filter(s => 
        s.name.toLowerCase().includes('remote') || 
        s.name.includes('远程') ||
        s.name.includes('RemoteOK') ||
        s.name.includes('We Work') ||
        s.name.includes('FlexJobs') ||
        s.name.includes('JustRemote') ||
        s.name.includes('Remotive')
    ).slice(0, 10); // 测试前10个远程源
    
    interface TestResult {
        name: string;
        url: string;
        status: string;
        itemCount: number;
        responseTime: string;
        error?: string;
        sampleData: Array<{title: string; link: string}>;
    }
    
    const results: TestResult[] = [];
    
    // 逐个测试数据源
    for (const source of remoteSources) {
        console.log(`正在测试: ${source.name}...`);
        try {
            const startTime = Date.now();
            const items = await fetchSource(source);
            const endTime = Date.now();
            
            results.push({
                name: source.name,
                url: source.url,
                status: '✅ 成功',
                itemCount: items.length,
                responseTime: `${endTime - startTime}ms`,
                sampleData: items.slice(0, 2).map(item => ({
                    title: item.title,
                    link: item.link
                }))
            });
        } catch (error) {
            results.push({
                name: source.name,
                url: source.url,
                status: '❌ 失败',
                error: (error as Error).message,
                itemCount: 0,
                responseTime: 'N/A',
                sampleData: []
            });
        }
    }
    
    // 生成测试报告HTML
    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>远程工作数据源测试报告</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body class="bg-gray-50 p-8">
        <div class="max-w-6xl mx-auto">
            <header class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">🔍 远程工作数据源测试报告</h1>
                <p class="text-gray-600">测试时间：${new Date().toLocaleString('zh-CN')}</p>
                <p class="text-gray-600">测试数量：${remoteSources.length} 个数据源</p>
            </header>
            
            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-semibold">测试结果</h2>
                        <div class="text-sm">
                            成功: ${results.filter(r => r.status.includes('✅')).length} | 
                            失败: ${results.filter(r => r.status.includes('❌')).length}
                        </div>
                    </div>
                </div>
                
                <div class="p-6">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b">
                                <th class="text-left py-3 px-4">数据源</th>
                                <th class="text-left py-3 px-4">状态</th>
                                <th class="text-left py-3 px-4">数据量</th>
                                <th class="text-left py-3 px-4">响应时间</th>
                                <th class="text-left py-3 px-4">示例数据</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${results.map(result => `
                                <tr class="border-b hover:bg-gray-50">
                                    <td class="py-3 px-4">
                                        <div>
                                            <div class="font-medium">${result.name}</div>
                                            <div class="text-xs text-gray-500 truncate max-w-xs">${result.url}</div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="${result.status.includes('✅') ? 'text-green-600' : 'text-red-600'}">
                                            ${result.status}
                                        </span>
                                        ${result.error ? `<div class="text-xs text-red-500 mt-1">${result.error}</div>` : ''}
                                    </td>
                                    <td class="py-3 px-4">
                                        <span class="${result.itemCount > 0 ? 'font-semibold text-blue-600' : 'text-gray-400'}">
                                            ${result.itemCount}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4 text-sm">
                                        ${result.responseTime}
                                    </td>
                                    <td class="py-3 px-4">
                                        ${result.sampleData.length > 0 ? `
                                            <div class="text-xs">
                                                ${result.sampleData.map(item => `
                                                    <div class="mb-1 truncate max-w-xs" title="${item.title}">
                                                        • ${item.title}
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
            
            <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="text-sm text-gray-600 mb-2">成功率</div>
                    <div class="text-3xl font-bold text-green-600">
                        ${Math.round(results.filter(r => r.status.includes('✅')).length / results.length * 100)}%
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="text-sm text-gray-600 mb-2">总数据量</div>
                    <div class="text-3xl font-bold text-blue-600">
                        ${results.reduce((sum, r) => sum + r.itemCount, 0)}
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <div class="text-sm text-gray-600 mb-2">平均响应时间</div>
                    <div class="text-3xl font-bold text-purple-600">
                        ${Math.round(results.filter(r => r.responseTime !== 'N/A').reduce((sum, r) => sum + parseInt(r.responseTime), 0) / results.filter(r => r.responseTime !== 'N/A').length || 0)}ms
                    </div>
                </div>
            </div>
            
            <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 class="font-semibold text-yellow-800 mb-2">
                    <i class="fas fa-info-circle mr-2"></i>注意事项
                </h3>
                <ul class="text-sm text-yellow-700 space-y-1">
                    <li>• 部分数据源可能需要代理或API密钥才能正常访问</li>
                    <li>• 某些网站有反爬虫机制，可能导致请求失败</li>
                    <li>• 数据量为0不一定表示源失效，可能是暂时没有匹配的数据</li>
                    <li>• 建议定期运行测试以监控数据源健康状况</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;
    
    ctx.header('Content-Type', 'text/html; charset=UTF-8');
    return ctx.body(html);
}
