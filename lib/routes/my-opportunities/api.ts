import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { fetchMultipleSourcesEnhanced } from './services/enhanced-fetcher';
import { filterItems, deduplicateItems, sortByDate, extractSalary } from './services/filter';
import type { JobItem } from './services/fetcher';

export const route: Route = {
    path: '/api',
    categories: ['other'],
    example: '/my-opportunities/api',
    parameters: {
        type: '数据类型：jobs/ideas/all，默认all',
        limit: '返回数量限制，默认50',
        region: '地区筛选：Global/CN/US/EU/UK/APAC',
    },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'API 数据接口',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        // 获取参数
        const { type = 'all', limit = '200', region = '' } = ctx.req.param() || {};
        const limitNum = Math.min(parseInt(limit), 500);
        
        // 获取数据源
        let sources = getAllSources();
        
        // 根据类型筛选数据源
        if (type === 'jobs') {
            sources = sources.filter(s => s.type === 'job');
        } else if (type === 'ideas') {
            sources = sources.filter(s => s.type === 'idea');
        }
        
        // 根据地区筛选
        if (region) {
            sources = sources.filter(s => s.region === region);
        }
        
        // 优先选择稳定的数据源
        const prioritySources = sources.filter(s => 
            s.name.includes('V2EX') || 
            s.name.includes('RemoteOK') || 
            s.name.includes('Reddit') ||
            s.name.includes('Working Nomads') ||
            s.name.includes('HackerNews') ||
            s.name.includes('Product Hunt') ||
            s.name.includes('Dev.to') ||
            s.name.includes('Indie')
        );
        
        // 如果优先源不够，补充其他源
        const otherSources = sources.filter(s => !prioritySources.includes(s));
        sources = [...prioritySources, ...otherSources].slice(0, 100); // 增加到100个数据源
        
        // 分离国内外数据源
        const chineseSources = sources.filter(s => s.region === 'CN' || s.name.includes('V2EX') || s.name.includes('电鸭'));
        const internationalSources = sources.filter(s => !chineseSources.includes(s));
        
        // 使用混合抓取策略
        const [chineseItems, internationalItems] = await Promise.all([
            fetchMultipleSources(chineseSources),
            fetchMultipleSourcesEnhanced(internationalSources)
        ]);
        
        // 合并结果
        const allItems = [...chineseItems, ...internationalItems];
        const uniqueItems = deduplicateItems(allItems);
        
        // 筛选高价值内容
        const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
        
        // 准备返回数据
        let resultItems: JobItem[] = [];
        if (type === 'jobs') {
            // 如果高价值职位为空，返回所有job类型的数据
            resultItems = highValueJobs.length > 0 ? highValueJobs : uniqueItems.filter(item => item.type === 'job');
        } else if (type === 'ideas') {
            // 如果商机为空，返回所有idea类型的数据
            resultItems = potentialIdeas.length > 0 ? potentialIdeas : uniqueItems.filter(item => item.type === 'idea');
        } else {
            // 如果过滤后数据太少，返回更多原始数据
            const filteredItems = [...highValueJobs, ...potentialIdeas];
            resultItems = filteredItems.length > 5 ? filteredItems : uniqueItems;
        }
        
        // 排序并限制数量
        resultItems = sortByDate(resultItems, true).slice(0, limitNum);
        
        // 格式化数据
        const formattedItems = resultItems.map(item => ({
            title: item.title,
            link: item.link,
            source: item.sourceName,
            region: item.region,
            author: item.author,
            description: item.description,
            type: item.type,
            timestamp: item.timestamp,
            salary: extractSalary(item.title + ' ' + item.meta),
            meta: item.meta
        }));
        
        // 返回 JSON 响应
        const response = {
            success: true,
            count: formattedItems.length,
            data: formattedItems,
            metadata: {
                totalSources: sources.length,
                type: type,
                region: region || 'all',
                timestamp: new Date().toISOString()
            }
        };
        
        ctx.header('Content-Type', 'application/json; charset=UTF-8');
        ctx.header('Cache-Control', 'max-age=600');
        return ctx.json(response);
        
    } catch (error) {
        ctx.status(500);
        return ctx.json({
            success: false,
            error: (error as Error).message,
            timestamp: new Date().toISOString()
        });
    }
}
