// lib/routes/comment2434/index.ts
import { Route } from '@/types';
import got from '@/utils/got';
import * as cheerio from 'cheerio';
import { parseDate } from '@/utils/parse-date';

export const route: Route = {
    path: '/:keyword',
    name: 'Comment2434',
    url: 'comment2434.com',
    maintainers: ['yourGitHubUsername'],
    example: '/comment2434/キーワード',
    parameters: {
        keyword: '検索キーワード',
    },
    handler,
};

async function handler(ctx) {
    const keyword = ctx.req.param('keyword');
    const url = `https://comment2434.com/comment/?keyword=${encodeURIComponent(keyword)}&type=0&mode=0&sort_mode=0`;

    const response = await got(url);

    const $ = cheerio.load(response.data);

    const items = $('#result .row')
        .toArray()
        .map((elem) => {
            const $elem = cheerio.load(elem);

            const title = $elem('h5').text().trim();
            const meta = $elem('p').eq(1).text().trim();
            const date = $elem('p').eq(2).text().trim();
            const linkPath = $elem('a').attr('href');
            const link = new URL(linkPath, 'https://comment2434.com').href;

            return {
                title,
                description: meta,
                pubDate: parseDate(date),
                link,
            };
        });

    // ✅ ESLintに認識されるよう、itemsを使って返す
    return {
        title: `comment2434 - ${keyword}`,
        link: url,
        item: items,
    };
}
