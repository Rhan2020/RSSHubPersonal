import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { fetchSourceEnhanced, fetchMultipleSourcesEnhanced } from './services/enhanced-fetcher';
import { filterItems, deduplicateItems, sortByDate, sortBySalary } from './services/filter';
import { generateHTML } from './templates/generator';

export const route: Route = {
    path: '/global-modular',
    categories: ['other'],
    example: '/my-opportunities/global-modular',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '全球高薪前端机会雷达（模块化版）',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        // 获取所有数据源
        let sources = getAllSources();
        console.log(`准备抓取 ${sources.length} 个数据源`);
        
        // 分离国内外数据源
        const chineseSources = sources.filter(s => s.region === 'CN' || s.name.includes('V2EX') || s.name.includes('电鸭'));
        const internationalSources = sources.filter(s => !chineseSources.includes(s));
        
        // 使用不同的抓取器
        const [chineseItems, internationalItems] = await Promise.all([
            fetchMultipleSources(chineseSources),
            fetchMultipleSourcesEnhanced(internationalSources)
        ]);
        
        // 合并结果
        const allItems = [...chineseItems, ...internationalItems];
        console.log(`成功获取 ${allItems.length} 条原始数据`);
        
        // 3. 去重
        const uniqueItems = deduplicateItems(allItems);
        console.log(`去重后剩余 ${uniqueItems.length} 条数据`);
        
        // 4. 筛选高价值内容
        const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
        console.log(`筛选出 ${highValueJobs.length} 个高薪职位，${potentialIdeas.length} 个商机`);
        
        // 5. 按时间排序
        const sortedJobs = sortByDate(highValueJobs, true);
        const sortedIdeas = sortByDate(potentialIdeas, true);
        
        // 6. 生成HTML
        const html = generateHTML(sortedJobs, sortedIdeas, sources.length);
        
        // 7. 返回响应
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        ctx.header('Cache-Control', 'max-age=600'); // 缓存10分钟
        return ctx.body(html);
        
    } catch (error) {
        console.error('处理请求时出错:', error);
        
        // 返回错误页面
        const errorHTML = `
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>错误 - 全球高薪前端机会雷达</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-gray-50 flex items-center justify-center min-h-screen">
                <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 class="text-2xl font-bold text-gray-800 mb-2">抱歉，出现了错误</h1>
                    <p class="text-gray-600 mb-4">数据加载失败，请稍后重试</p>
                    <p class="text-sm text-gray-500 mb-6">错误信息: ${(error as Error).message}</p>
                    <button onclick="window.location.reload()" 
                            class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        重新加载
                    </button>
                </div>
            </body>
            </html>
        `;
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        ctx.status(500);
        return ctx.body(errorHTML);
    }
}
