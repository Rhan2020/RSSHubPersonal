import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { fetchMultipleSourcesEnhanced } from './services/enhanced-fetcher';
import { filterItems, deduplicateItems, sortByDate } from './services/filter';
import { generateHTMLWithDB } from './templates/generator-with-db';

export const route: Route = {
    path: '/dashboard',
    categories: ['other'],
    example: '/my-opportunities/dashboard',
    parameters: {},
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: '全球高薪前端机会雷达（快速版）',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        // 获取所有数据源
        const allSources = getAllSources();
        
        // 使用更多数据源以达到200-300的目标
        // 直接使用前100个数据源，确保获取足够数据
        const prioritySources = allSources.slice(0, 100); // 使用100个数据源
        
        // 分离国内外数据源
        const chineseSources = prioritySources.filter(s => 
            s.region === 'CN' || 
            s.name.includes('V2EX') || 
            s.name.includes('电鸭')
        );
        const internationalSources = prioritySources.filter(s => 
            !chineseSources.includes(s)
        );
        
        console.log(`Dashboard: 准备抓取 ${prioritySources.length} 个数据源`);
        console.log(`- 国内源: ${chineseSources.length} 个`);
        console.log(`- 国际源: ${internationalSources.length} 个`);
        
        // 使用混合抓取策略
        const [chineseItems, internationalItems] = await Promise.all([
            fetchMultipleSources(chineseSources),
            fetchMultipleSourcesEnhanced(internationalSources)
        ]);
        
        // 合并结果
        const allItems = [...chineseItems, ...internationalItems];
        console.log(`Dashboard: 获取 ${allItems.length} 条原始数据`);
        
        // 去重
        const uniqueItems = deduplicateItems(allItems);
        console.log(`Dashboard: 去重后剩余 ${uniqueItems.length} 条数据`);
        
        // 筛选高价值内容
        const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
        
        // 准备要传递给客户端的数据
        const dataForStorage = {
            jobs: highValueJobs,
            ideas: potentialIdeas,
            allItems: uniqueItems,
            timestamp: new Date().toISOString()
        };
        console.log(`Dashboard: 筛选出 ${highValueJobs.length} 个高薪职位，${potentialIdeas.length} 个商机`);
        
        // 排序并限制数量（增加显示数量）
        const sortedJobs = sortByDate(highValueJobs, true).slice(0, 150);  // 显示前150个职位
        const sortedIdeas = sortByDate(potentialIdeas, true).slice(0, 100); // 显示前100个商机
        
        // 生成HTML
        const html = generateHTMLWithDB(
            sortedJobs,
            sortedIdeas,
            {
                sources: prioritySources.length,
                avgSalary: 0, // 可以计算平均薪资
                totalJobs: highValueJobs.length,
                totalIdeas: potentialIdeas.length,
            },
            {
                title: '全球高薪前端机会雷达 - 快速版',
                mode: 'dashboard',
                dataForStorage: dataForStorage
            }
        );
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        ctx.header('Cache-Control', 'public, max-age=300'); // 缓存5分钟
        return ctx.body(html);
    } catch (error) {
        console.error('Dashboard error:', error);
        
        // 返回友好的错误页面
        const errorHtml = `
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>加载出错 - 机会雷达</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 flex items-center justify-center min-h-screen">
            <div class="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                <div class="text-6xl mb-4">😔</div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">数据加载失败</h1>
                <p class="text-gray-600 mb-6">抱歉，暂时无法获取数据，请稍后重试</p>
                <div class="space-y-3">
                    <a href="/my-opportunities/dashboard" class="block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        刷新重试
                    </a>
                    <a href="/my-opportunities" class="block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        返回导航页
                    </a>
                </div>
                <p class="text-xs text-gray-500 mt-4">错误信息: ${(error as Error).message || '未知错误'}</p>
            </div>
        </body>
        </html>
        `;
        
        ctx.header('Content-Type', 'text/html; charset=UTF-8');
        ctx.status = 500;
        return ctx.body(errorHtml);
    }
}
