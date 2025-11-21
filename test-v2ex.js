/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
const got = require('@/lib/utils/got');
const cheerio = require('cheerio');

async function testV2EX() {
    try {
        console.log('正在测试V2EX远程工作板块...');
        const response = await got.get('https://www.v2ex.com/go/remote', { 
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        
        let count = 0;
        $('#TopicsNode .cell').each((_, el) => {
            const $el = $(el);
            const title = $el.find('.item_title a').text().trim();
            if (title) {
                count++;
                console.log(`  ${count}. ${title}`);
            }
        });
        
        console.log(`\n✅ 成功获取 ${count} 条数据`);
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
    }
}

testV2EX();
