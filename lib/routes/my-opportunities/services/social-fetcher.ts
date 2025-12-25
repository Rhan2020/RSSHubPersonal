import got from '@/utils/got';
import { load } from 'cheerio';
import type { DataSource } from '../config/sources';
import type { JobItem } from './fetcher';
import { socialMediaKeywords } from '../config/social-media-sources';

// LinkedIn 职位抓取
export async function fetchLinkedIn(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Accept: 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // LinkedIn 职位卡片选择器
        $('.jobs-search__results-list li, .job-card-container').each((_, el) => {
            const $el = $(el);
            const title = $el.find('.base-search-card__title, .job-card-container__link').text().trim();
            const company = $el.find('.base-search-card__subtitle, .job-card-container__company-name').text().trim();
            const location = $el.find('.job-search-card__location, .job-card-container__metadata-item').text().trim();
            const link = $el.find('a').first().attr('href') || '';
            const salary = $el.find('.job-card-container__salary-info').text().trim();

            if (title && link) {
                items.push({
                    title: `${company} - ${title}`,
                    link: link.startsWith('http') ? link : `https://www.linkedin.com${link}`,
                    meta: `${location} ${salary}`.trim(),
                    author: company,
                    description: $el.find('.base-search-card__snippet').text().trim(),
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items;
    } catch {
        return [];
    }
}

// Twitter/X 抓取
export async function fetchTwitter(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url.replace('twitter.com', 'nitter.net'), {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // Nitter timeline 选择器
        $('.timeline-item').each((_, el) => {
            const $el = $(el);
            const content = $el.find('.tweet-content').text().trim();
            const author = $el.find('.username').text().trim();
            const link = $el.find('.tweet-link').attr('href') || '';
            const time = $el.find('.tweet-date').attr('title') || '';

            // 检查是否包含招聘关键词
            const hasJobKeyword = socialMediaKeywords.twitter.some((kw) => content.toLowerCase().includes(kw.toLowerCase()));

            if (hasJobKeyword && content) {
                items.push({
                    title: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                    link: link.startsWith('http') ? link : `https://twitter.com${link}`,
                    meta: `@${author} • ${time}`,
                    author,
                    description: content,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: time || new Date().toISOString(),
                });
            }
        });

        return items;
    } catch {
        return [];
    }
}

// Facebook Groups 抓取
export async function fetchFacebook(source: DataSource): Promise<JobItem[]> {
    try {
        // Facebook 需要特殊处理，可能需要使用 Graph API 或其他方法
        // 这里提供基础实现框架
        const response = await got.get(source.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // Facebook Group 帖子选择器（可能需要调整）
        $('.userContentWrapper, div[role="article"]').each((_, el) => {
            const $el = $(el);
            const content = $el.find('.userContent, div[data-ad-preview="message"]').text().trim();
            const author = $el.find('h5 a, strong').first().text().trim();
            const link = $el.find('a[href*="/groups/"]').first().attr('href') || '';

            // 检查是否包含招聘关键词
            const hasJobKeyword = socialMediaKeywords.facebook.some((kw) => content.toLowerCase().includes(kw.toLowerCase()));

            if (hasJobKeyword && content) {
                items.push({
                    title: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                    link: link.startsWith('http') ? link : `https://www.facebook.com${link}`,
                    meta: `${author} • Facebook Group`,
                    author,
                    description: content,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items;
    } catch {
        return [];
    }
}

// Discord API 抓取
export async function fetchDiscord(source: DataSource): Promise<JobItem[]> {
    try {
        // Discord 需要使用其 API 或 webhook
        // 这里提供基础框架，实际需要配置 Discord Bot Token
        const items: JobItem[] = [];

        // 如果有 Discord webhook URL
        if (source.url.includes('discord.com/api/webhooks')) {
            const response = await got.get(source.url, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN || ''}`,
                },
            });

            const messages = JSON.parse(response.body);

            if (Array.isArray(messages)) {
                for (const msg of messages) {
                    if (msg.content && socialMediaKeywords.channels.some((ch) => msg.channel_name?.includes(ch))) {
                        items.push({
                            title: msg.content.slice(0, 100),
                            link: source.url,
                            meta: `${msg.author?.username || 'Unknown'} • Discord`,
                            author: msg.author?.username || 'Unknown',
                            description: msg.content,
                            sourceName: source.name,
                            type: source.type,
                            region: source.region,
                            timestamp: msg.timestamp || new Date().toISOString(),
                        });
                    }
                }
            }
        }

        return items;
    } catch {
        return [];
    }
}

// Telegram 频道抓取
export async function fetchTelegram(source: DataSource): Promise<JobItem[]> {
    try {
        // 使用 Telegram 的 web 预览
        const channelName = source.url.match(/t\.me\/([^/]+)/)?.[1];
        if (!channelName) {return [];}

        const previewUrl = `https://t.me/s/${channelName}`;
        const response = await got.get(previewUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // Telegram web 预览消息选择器
        $('.tgme_widget_message').each((_, el) => {
            const $el = $(el);
            const content = $el.find('.tgme_widget_message_text').text().trim();
            const author = $el.find('.tgme_widget_message_owner_name').text().trim();
            const link = $el.find('.tgme_widget_message_date').attr('href') || '';
            const time = $el.find('.tgme_widget_message_date time').attr('datetime') || '';

            if (content) {
                items.push({
                    title: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                    link: link || source.url,
                    meta: `${author || channelName} • Telegram`,
                    author: author || channelName || 'Unknown',
                    description: content,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: time || new Date().toISOString(),
                });
            }
        });

        return items;
    } catch {
        return [];
    }
}

// Instagram 抓取（通过 Web）
export async function fetchInstagram(source: DataSource): Promise<JobItem[]> {
    try {
        // Instagram 限制严格，可能需要使用第三方服务
        // 这里使用 Picuki 作为代理
        const tag = source.url.match(/tags\/([^/]+)/)?.[1];
        if (!tag) {return [];}

        const proxyUrl = `https://www.picuki.com/tag/${tag}`;
        const response = await got.get(proxyUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        $('.box-photo').each((_, el) => {
            const $el = $(el);
            const content = $el.find('.photo-description').text().trim();
            const author = $el.find('.photo-username').text().trim();
            const link = $el.find('a').first().attr('href') || '';

            // 检查是否包含招聘关键词
            const hasJobKeyword = socialMediaKeywords.instagram.some((kw) => content.toLowerCase().includes(kw.toLowerCase()));

            if (hasJobKeyword && content) {
                items.push({
                    title: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                    link: link || source.url,
                    meta: `@${author} • Instagram`,
                    author,
                    description: content,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items;
    } catch {
        return [];
    }
}

// Medium 文章抓取
export async function fetchMedium(source: DataSource): Promise<JobItem[]> {
    try {
        // Medium 提供 RSS feed
        await got.get(source.url.replace('/latest', '/feed'), {
            timeout: 15000,
        });

        // 这里可以使用 RSS parser 处理
        // 简化处理，返回空数组
        return [];
    } catch {
        return [];
    }
}

// 主社交媒体抓取调度器
export function fetchSocialMedia(source: DataSource): Promise<JobItem[]> {
    const platform = source.category?.toLowerCase();

    switch (platform) {
        case 'linkedin':
            return fetchLinkedIn(source);
        case 'twitter':
            return fetchTwitter(source);
        case 'facebook':
            return fetchFacebook(source);
        case 'instagram':
            return fetchInstagram(source);
        case 'discord':
            return fetchDiscord(source);
        case 'telegram':
            return fetchTelegram(source);
        case 'medium':
            return fetchMedium(source);
        default:
            // 使用通用 HTML 抓取
            return fetchGenericSocial(source);
    }
}

// 通用社交媒体抓取
async function fetchGenericSocial(source: DataSource): Promise<JobItem[]> {
    try {
        const response = await got.get(source.url, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        const $ = load(response.data);
        const items: JobItem[] = [];

        // 尝试通用选择器
        $('article, .post, .item, .card').each((_, el) => {
            const $el = $(el);
            const title = $el.find('h1, h2, h3, .title').first().text().trim();
            const content = $el.find('p, .content, .description').first().text().trim();
            const link = $el.find('a').first().attr('href') || '';

            if (title || content) {
                items.push({
                    title: title || content.slice(0, 100),
                    link: link.startsWith('http') ? link : new URL(link, source.url).href,
                    meta: source.name,
                    author: 'Unknown',
                    description: content,
                    sourceName: source.name,
                    type: source.type,
                    region: source.region,
                    timestamp: new Date().toISOString(),
                });
            }
        });

        return items.slice(0, 20);
    } catch {
        return [];
    }
}
