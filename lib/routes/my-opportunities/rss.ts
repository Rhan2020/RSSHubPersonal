import { Route } from '@/types';
import { getAllSources } from './config/sources';
import { fetchMultipleSources } from './services/fetcher';
import { filterItems, deduplicateItems, sortByDate, extractSalary } from './services/filter';

export const route: Route = {
    path: '/rss',
    categories: ['other'],
    example: '/my-opportunities/rss',
    parameters: {
        type: '数据类型：jobs/ideas/all，默认jobs',
        limit: '返回数量，默认30',
    },
    features: {
        requireConfig: false,
        requirePuppeteer: false,
        antiCrawler: false,
        supportBT: false,
        supportPodcast: false,
        supportScihub: false,
    },
    name: 'RSS 订阅源',
    maintainers: ['frontend-hunter'],
    handler,
};

export async function handler(ctx) {
    try {
        const { type = 'jobs', limit = '30' } = ctx.req.param() || {};
        const limitNum = parseInt(limit);
        
        // 获取数据源
        let sources = getAllSources();
        
        // 根据类型筛选
        if (type === 'jobs') {
            sources = sources.filter(s => s.type === 'job');
        } else if (type === 'ideas') {
            sources = sources.filter(s => s.type === 'idea');
        }
        
        // 限制数据源数量
        sources = sources.slice(0, 20);
        
        // 抓取数据
        const allItems = await fetchMultipleSources(sources);
        const uniqueItems = deduplicateItems(allItems);
        const { highValueJobs, potentialIdeas } = filterItems(uniqueItems);
        
        // 选择数据
        let items = type === 'ideas' ? potentialIdeas : highValueJobs;
        // 如果过滤后没有数据，使用原始数据
        if (items.length === 0) {
            items = type === 'ideas' ? 
                uniqueItems.filter(item => item.type === 'idea') : 
                uniqueItems.filter(item => item.type === 'job');
        }
        items = sortByDate(items, true).slice(0, limitNum);
        
        ctx.set('Content-Type', 'application/rss+xml; charset=UTF-8');
        ctx.set('Cache-Control', 'max-age=600');
        return {
            title: `全球高薪前端机会雷达 - ${type === 'jobs' ? '职位' : '商机'}`,
            link: 'http://localhost:1200/my-opportunities',
            description: '高薪前端职位和商业机会监控，月薪$10k+',
            item: items.map(item => {
                const salary = extractSalary(item.title + ' ' + (item.meta || ''));
                const salaryText = salary > 0 ? ` [$${Math.round(salary/1000)}k]` : '';
                
                return {
                    title: `${item.title}${salaryText}`,
                    link: item.link,
                    description: `
                        <p><strong>来源:</strong> ${item.sourceName}</p>
                        <p><strong>地区:</strong> ${item.region}</p>
                        <p><strong>作者:</strong> ${item.author}</p>
                        ${item.description ? `<p><strong>描述:</strong> ${item.description}</p>` : ''}
                        ${item.meta ? `<p><strong>附加信息:</strong> ${item.meta}</p>` : ''}
                    `,
                    pubDate: new Date(item.timestamp).toUTCString(),
                    guid: item.link,
                    source: item.sourceName
                };
            })
        };
        
    } catch (error) {
        console.error('RSS generation error:', error);
        throw error;
    }
}
