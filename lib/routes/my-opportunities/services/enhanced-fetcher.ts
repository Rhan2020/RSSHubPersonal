import got from '@/utils/got';
import cache from '@/utils/cache';
import { load } from 'cheerio';
import Parser from 'rss-parser';
import type { DataSource } from '../config/sources';
import type { JobItem } from './fetcher';

const parser = new Parser({
    customFields: {
        item: ['description', 'content:encoded', 'summary'],
    },
    headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
});

// 增强的请求配置
const enhancedHeaders = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    Referer: 'https://www.google.com/',
};

// RemoteOK 专用抓取（修复版）
export async function fetchRemoteOKEnhanced(source: DataSource): Promise<JobItem[]> {
    try {
        // RemoteOK API 需要特殊处理
        const apiUrl = 'https://remoteok.com/api';
        const response = await got.get(apiUrl, {
            timeout: 20000,
            headers: {
                ...enhancedHeaders,
                Accept: 'application/json',
            },
            retry: {
                limit: 3,
                methods: ['GET'],
            },
        });

        let data;
        try {
            data = JSON.parse(response.body);
        } catch {
            return [];
        }

        // 第一个元素是 legal 信息，需要跳过
        const jobs = Array.isArray(data) ? data.slice(1) : [];

        // 根据source.url中的tag进行过滤
        const tags = source.url.includes('tag=')
            ? source.url
                  .split('tag=')[1]
                  .split(',')
                  .map((t) => t.toLowerCase())
            : ['frontend', 'react', 'vue', 'javascript'];

        return jobs
            .filter((job: any) => {
                if (!job.position) {return false;}
                const jobText = `${job.position} ${job.tags?.join(' ') || ''}`.toLowerCase();
                return tags.some((tag) => jobText.includes(tag));
            })
            .slice(0, 50)
            .map((job: any) => {
                let salary = '';
                if (job.salary_min && job.salary_max) {
                    // 转换年薪为月薪
                    const minMonthly = Math.round(job.salary_min / 12);
                    const maxMonthly = Math.round(job.salary_max / 12);
                    salary = `$${minMonthly}-${maxMonthly}/月`;
                }

                return {
                    title: job.position,
                    link: job.url || `https://remoteok.com/remote-jobs/${job.slug}`,
                    meta: `${job.company} • ${job.location || 'Remote'} ${salary}`,
                    author: job.company,
                    description: job.description?.slice(0, 200) || '',
                    tags: job.tags || [],
                    salary,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: job.date ? new Date(job.date).toISOString() : new Date().toISOString(),
                };
            });
    } catch {
        return [];
    }
}

// We Work Remotely 专用抓取
export async function fetchWWREnhanced(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 20000,
            headers: enhancedHeaders,
            retry: {
                limit: 3,
                methods: ['GET'],
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // We Work Remotely 的特定选择器
        $('li.feature, section.jobs article').each((_, el) => {
            const $el = $(el);
            const $link = $el.find('a[href*="/remote-jobs/"]').first();
            const title = $el.find('.title, h2, h3').first().text().trim();
            const company = $el.find('.company, .company-name').first().text().trim();
            const location = $el.find('.region, .location').first().text().trim();
            const href = $link.attr('href');

            if (title && href) {
                items.push({
                    title,
                    link: href.startsWith('http') ? href : `https://weworkremotely.com${href}`,
                    meta: `${company} • ${location || 'Remote'}`,
                    author: company || 'Unknown',
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items.slice(0, 50);
    } catch {
        return [];
    }
}

// FlexJobs RSS 增强抓取
export async function fetchFlexJobsRSS(source: DataSource): Promise<JobItem[]> {
    try {
        // FlexJobs 可能需要特殊处理
        const feed = await parser.parseURL(source.url);
        return feed.items.slice(0, 50).map((item) => {
            // 尝试从描述中提取薪资信息
            let salary = '';
            const description = item.contentSnippet || item.content || '';
            const salaryMatch = description.match(/\$[\d,]+(?:\s*-\s*\$[\d,]+)?(?:\/(?:year|month|hour))?/i);
            if (salaryMatch) {
                salary = salaryMatch[0];
            }

            return {
                title: item.title || 'No Title',
                link: item.link || '',
                meta: `${item.pubDate || ''} ${salary}`,
                author: (item as any).creator || (item as any).author || 'Unknown',
                description: description.slice(0, 200),
                salary,
                sourceName: source.name,
                type: source.type,
                region: source.region,
                timestamp: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            };
        });
    } catch {
        return [];
    }
}

// Remote.co 专用抓取
export async function fetchRemoteCo(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 20000,
            headers: enhancedHeaders,
            retry: {
                limit: 3,
                methods: ['GET'],
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // Remote.co 的特定选择器
        $('.job_listing, .job-listing, .card-job').each((_, el) => {
            const $el = $(el);
            const title = $el.find('h2, h3, .job-title, .position').first().text().trim();
            const company = $el.find('.company, .company-name, h4').first().text().trim();
            const $link = $el.find('a[href*="/job/"], a[href*="/remote-job/"]').first();
            const href = $link.attr('href');
            const tags: string[] = [];
            $el.find('.job-tag, .tag').each((_, tag) => {
                tags.push($(tag).text().trim());
            });

            // 寻找薪资信息
            let salary = '';
            const salaryEl = $el.find('.salary, .compensation').text();
            if (salaryEl) {
                salary = salaryEl.trim();
            }

            if (title && href) {
                items.push({
                    title,
                    link: href.startsWith('http') ? href : `https://remote.co${href}`,
                    meta: `${company} ${salary}`,
                    author: company || 'Unknown',
                    tags,
                    salary,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items.slice(0, 50);
    } catch {
        return [];
    }
}

// JustRemote API 抓取
export async function fetchJustRemote(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 20000,
            headers: {
                ...enhancedHeaders,
                Accept: 'application/json',
            },
            retry: {
                limit: 3,
                methods: ['GET'],
            },
        });

        const data = JSON.parse(response.body);
        let jobs: any[] = [];

        // 处理不同的数据结构
        if (Array.isArray(data)) {
            jobs = data;
        } else if (data.data && Array.isArray(data.data)) {
            jobs = data.data;
        } else if (data.jobs && Array.isArray(data.jobs)) {
            jobs = data.jobs;
        }

        return jobs.slice(0, 50).map((job: any) => ({
            title: job.title || job.position || job.job_title || '',
            link: job.url || job.link || job.apply_url || `https://justremote.co/remote-job/${job.id}`,
            meta: `${job.company || job.company_name || ''} • ${job.location || 'Remote'}`,
            author: job.company || job.company_name || 'Unknown',
            description: job.description?.slice(0, 200) || '',
            tags: job.tags || job.categories || [],
            salary: job.salary || '',
            sourceName: source.name,
            type: source.type,
            region: source.region,
            timestamp: job.created_at || job.posted_at || new Date().toISOString(),
        }));
    } catch {
        return [];
    }
}

// Remotive API 抓取
export async function fetchRemotive(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 20000,
            headers: {
                ...enhancedHeaders,
                Accept: 'application/json',
            },
            retry: {
                limit: 3,
                methods: ['GET'],
            },
        });

        const data = JSON.parse(response.body);
        const jobs = data.jobs || data.data || [];

        return jobs.slice(0, 50).map((job: any) => {
            // 处理薪资
            let salary = '';
            if (job.salary) {
                salary = job.salary;
            } else if (job.candidate_required_location?.includes('$')) {
                salary = job.candidate_required_location;
            }

            return {
                title: job.title || '',
                link: job.url || `https://remotive.io/remote-jobs/${job.slug}`,
                meta: `${job.company_name || ''} • ${job.category || ''} ${salary}`,
                author: job.company_name || 'Unknown',
                description: job.description?.slice(0, 200) || '',
                tags: job.tags || [job.category],
                salary,
                sourceName: source.name,
                type: source.type,
                region: source.region,
                timestamp: job.publication_date || job.published_at || new Date().toISOString(),
            };
        });
    } catch {
        return [];
    }
}

// 主增强抓取函数
export async function fetchSourceEnhanced(source: DataSource): Promise<JobItem[]> {
    try {
        const cacheKey = `opportunity:enhanced:${source.name}:v3`;
        const cached = await cache.get(cacheKey);
        if (cached && Array.isArray(cached)) {return cached as unknown as JobItem[];}

        let items: JobItem[] = [];

        // 根据数据源名称使用专门的抓取器
        if (source.name.includes('RemoteOK')) {
            items = await fetchRemoteOKEnhanced(source);
        } else if (source.name.includes('We Work Remotely')) {
            items = await fetchWWREnhanced(source);
        } else if (source.name.includes('FlexJobs')) {
            items = await fetchFlexJobsRSS(source);
        } else if (source.name.includes('Remote.co')) {
            items = await fetchRemoteCo(source);
        } else if (source.name.includes('JustRemote')) {
            items = await fetchJustRemote(source);
        } else if (source.name.includes('Remotive')) {
            items = await fetchRemotive(source);
        } else if (source.dataType === 'rss') {
            // 使用增强的RSS解析器
            items = await fetchFlexJobsRSS(source);
        } else {
            // 其他情况返回空数组
            return [];
        }

        // 确保返回的是数组
        if (!Array.isArray(items)) {
            return [];
        }

        // 缓存结果（10分钟）
        if (items.length > 0) {
            await cache.set(cacheKey, items, 600);
        }

        return items;
    } catch {
        return [];
    }
}

// 批量增强抓取
export async function fetchMultipleSourcesEnhanced(sources: DataSource[]): Promise<JobItem[]> {
    const batchSize = 5; // 降低并发数
    const results: JobItem[] = [];
    const batches: DataSource[][] = [];

    for (let i = 0; i < sources.length; i += batchSize) {
        batches.push(sources.slice(i, i + batchSize));
    }

    const batchPromises = batches.map(async (batch) => {
        const batchResults = await Promise.allSettled(batch.map((s) => fetchSourceEnhanced(s)));
        const items: JobItem[] = [];
        for (const result of batchResults) {
            if (result.status === 'fulfilled' && result.value) {
                items.push(...result.value);
            }
        }
        return items;
    });

    const allBatchResults = await Promise.all(batchPromises);
    for (const batchItems of allBatchResults) {
        results.push(...batchItems);
    }

    return results;
}
