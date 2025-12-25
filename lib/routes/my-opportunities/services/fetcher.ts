import got from '@/utils/got';
import cache from '@/utils/cache';
import { load } from 'cheerio';
import Parser from 'rss-parser';
import type { DataSource } from '../config/sources';
import { fetchSocialMedia } from './social-fetcher';

const parser = new Parser();

export interface JobItem {
    title: string;
    link: string;
    meta: string;
    author: string;
    description?: string;
    sourceName: string;
    type: 'job' | 'idea';
    region: string;
    timestamp: string;
    salary?: string;
    tags?: string[];
}

// 主抓取函数
export async function fetchSource(source: DataSource): Promise<JobItem[]> {
    try {
        // 尝试从缓存获取
        const cacheKey = `opportunity:${source.name}:v2`;
        const cached = await cache.get(cacheKey);
        if (cached) {return cached as unknown as JobItem[];}

        let items: JobItem[] = [];

        // 检查是否是社交媒体数据源
        const socialPlatforms = ['LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Discord', 'Telegram', 'Slack', 'Medium', 'TikTok', 'Threads', 'Mastodon', 'YouTube', 'Pinterest', 'Quora'];
        const isSocialMedia = socialPlatforms.some((platform) => source.category?.toLowerCase() === platform.toLowerCase() || source.name.includes(platform));

        if (isSocialMedia) {
            // 使用社交媒体专用抓取器
            items = await fetchSocialMedia(source);
        } else {
            // 根据数据类型调用不同的抓取方法
            switch (source.dataType) {
                case 'v2ex-html':
                    items = await fetchV2EX(source);
                    break;
                case 'rss':
                    items = await fetchRSS(source);
                    break;
                case 'remoteok-json':
                    items = await fetchRemoteOK(source);
                    break;
                case 'hn-json':
                    items = await fetchHackerNews(source);
                    break;
                case 'eleduck-json':
                    items = await fetchEleDuck(source);
                    break;
                case 'json':
                    items = await fetchGenericJSON(source);
                    break;
                case 'html':
                    items = await fetchGenericHTML(source);
                    break;
                default:
                // Unsupported data type
            }
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

// V2EX 抓取
async function fetchV2EX(source: DataSource): Promise<JobItem[]> {
    const response = await got.get(source.url, { timeout: 10000 });
    const $ = load(response.data);
    const items: JobItem[] = [];

    $('#TopicsNode .cell').each((_, el) => {
        const $el = $(el);
        const titleEl = $el.find('.item_title a');
        const title = titleEl.text().trim();
        const link = titleEl.attr('href');
        const fullLink = link ? `https://www.v2ex.com${link}` : '';

        const author = $el.find('.topic_info strong a').first().text() || 'Unknown';
        const replyCount = $el.find('.count_livid').text() || '0';

        if (title && fullLink) {
            items.push({
                title,
                link: fullLink,
                meta: `${author} • ${replyCount} 回复`,
                author,
                sourceName: source.name,
                type: source.type,
                region: source.region,
                timestamp: new Date().toISOString(),
            });
        }
    });

    return items;
}

// RSS 抓取
async function fetchRSS(source: DataSource): Promise<JobItem[]> {
    const feed = await parser.parseURL(source.url);
    return feed.items.slice(0, 50).map((item) => ({
        title: item.title || 'No Title',
        link: item.link || '',
        meta: item.pubDate || '',
        author: item.creator || item.author || 'Unknown',
        description: item.contentSnippet || item.content || '',
        sourceName: source.name,
        type: source.type,
        region: source.region,
        timestamp: item.pubDate || new Date().toISOString(),
    }));
}

// RemoteOK 抓取
async function fetchRemoteOK(source: DataSource): Promise<JobItem[]> {
    try {
        // RemoteOK API不支持tag参数，使用基础API
        const apiUrl = 'https://remoteok.com/api';
        const response = await got.get(apiUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });
        const data = JSON.parse(response.body);

        // RemoteOK第一个元素是legal信息，需要跳过
        const jobs = Array.isArray(data) ? data.slice(1) : [];

        // 根据source.url中的tag进行本地过滤
        const tags = source.url.includes('tag=')
            ? source.url
                  .split('tag=')[1]
                  .split(',')
                  .map((t) => t.toLowerCase())
            : ['frontend', 'react', 'vue', 'javascript'];

        return jobs
            .slice(0, 100)
            .filter((d: any) => {
                if (!d.id || !d.position) {return false;}
                // 过滤前端相关职位
                const jobText = `${d.position} ${d.tags?.join(' ') || ''}`.toLowerCase();
                return tags.some((tag) => jobText.includes(tag));
            })
            .map((d: any) => {
                let salary = '';
                if (d.salary_min && d.salary_max) {
                    salary = `$${d.salary_min}-${d.salary_max}`;
                }

                return {
                    title: `${d.company} - ${d.position}`,
                    link: d.url || `https://remoteok.com/remote-jobs/${d.slug}`,
                    meta: `${d.location || 'Worldwide'} ${salary}`,
                    author: d.company,
                    description: d.description || '',
                    tags: d.tags || [],
                    salary,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: d.date || new Date().toISOString(),
                };
            });
    } catch {
        return [];
    }
}

// HackerNews 抓取
async function fetchHackerNews(source: DataSource): Promise<JobItem[]> {
    const response = await got.get(source.url, { timeout: 10000 });
    const data = JSON.parse(response.body);

    return data.hits.slice(0, 50).map((h: any) => ({
        title: h.title || h.story_title || '',
        link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`,
        meta: `${h.points || 0} points • ${h.num_comments || 0} comments`,
        author: h.author,
        sourceName: source.name,
        type: source.type,
        region: source.region,
        timestamp: h.created_at,
    }));
}

// 电鸭社区抓取
async function fetchEleDuck(source: DataSource): Promise<JobItem[]> {
    const response = await got.get(source.url, { timeout: 10000 });
    const data = JSON.parse(response.body);

    if (data.data && data.data.posts) {
        return data.data.posts.slice(0, 50).map((p: any) => ({
            title: p.title,
            link: `https://eleduck.com/posts/${p.id}`,
            meta: `${p.user?.nickname || 'Unknown'} • ${p.comments_count || 0} 评论`,
            author: p.user?.nickname || 'Unknown',
            sourceName: source.name,
            type: source.type,
            region: source.region,
            timestamp: p.published_at,
        }));
    }
    return [];
}

// 通用 JSON API 抓取
async function fetchGenericJSON(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });
        const data = JSON.parse(response.body);

        // 尝试自动识别数据结构
        let items: any[] = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (data.jobs && Array.isArray(data.jobs)) {
            items = data.jobs;
        } else if (data.data?.children && Array.isArray(data.data.children)) {
            // Reddit API 格式
            items = data.data.children.map((child: any) => child.data);
        } else if (data.data && Array.isArray(data.data)) {
            items = data.data;
        } else if (data.results && Array.isArray(data.results)) {
            items = data.results;
        } else if (data.listings && Array.isArray(data.listings)) {
            items = data.listings;
        }

        return items.slice(0, 50).map((item: any) => {
            // Reddit特殊处理
            let link = item.url || item.link || item.job_url || '';
            if (source.name.includes('Reddit') && item.permalink) {
                link = `https://reddit.com${item.permalink}`;
            }

            // 提取作者信息
            let author = item.company || item.employer || item.author || 'Unknown';
            if (source.name.includes('Reddit')) {
                author = item.author || 'Unknown';
            }

            // 处理描述
            const description = item.description || item.summary || item.selftext || '';

            // 处理时间戳
            let timestamp = item.created_at || item.published || item.date_posted;
            if (source.name.includes('Reddit') && item.created_utc) {
                timestamp = new Date(item.created_utc * 1000).toISOString();
            } else if (!timestamp) {
                timestamp = new Date().toISOString();
            }

            return {
                title: item.title || item.position || item.job_title || 'Unknown',
                link,
                meta: item.company || item.employer || '',
                author,
                description,
                sourceName: source.name,
                type: source.type,
                region: source.region,
                timestamp,
            };
        });
    } catch {
        return [];
    }
}

// ...
// 通用 HTML 抓取（需要根据实际网站结构调整）
async function fetchGenericHTML(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });
        const $ = load(response.data);
        const items: JobItem[] = [];

        // 尝试一些常见的选择器
        const selectors = ['.job-listing', '.job-item', '.job-card', '.listing-item', 'article.job', '.opportunity', '.position'];

        for (const selector of selectors) {
            if ($(selector).length > 0) {
                $(selector).each((_, el) => {
                    const $el = $(el);
                    const title = $el.find('h2, h3, .title, .job-title').first().text().trim();
                    const link = $el.find('a').first().attr('href') || '';
                    const company = $el.find('.company, .employer').first().text().trim();

                    if (title) {
                        items.push({
                            title,
                            link: link.startsWith('http') ? link : new URL(link, source.url).href,
                            meta: company,
                            author: company || 'Unknown',
                            sourceName: source.name,
                            type: source.type,
                            region: source.region,
                            timestamp: new Date().toISOString(),
                        });
                    }
                });
                break;
            }
        }

        return items.slice(0, 50);
    } catch {
        return [];
    }
}

// 批量抓取
export async function fetchMultipleSources(sources: DataSource[]): Promise<JobItem[]> {
    // 分批处理，避免并发过多
    const batchSize = 10;
    const results: JobItem[] = [];
    const batches: DataSource[][] = [];

    for (let i = 0; i < sources.length; i += batchSize) {
        batches.push(sources.slice(i, i + batchSize));
    }

    const batchPromises = batches.map(async (batch) => {
        const batchResults = await Promise.allSettled(batch.map((s) => fetchSource(s)));
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
