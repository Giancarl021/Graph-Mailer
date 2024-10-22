import { BodyType, EmailOptions } from '../interfaces';

import hljs from 'highlight.js';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { load } from 'cheerio';
import { lookup } from 'mime-types';
import { readFileSync } from 'fs';
import locate from '@giancarl021/locate';
import { basename, dirname } from 'path';

type RestrictedBodyType = Exclude<BodyType, 'markdown'>;

const window = new JSDOM('').window as unknown as Window;
const purify = DOMPurify(window);

const highlightJsCss = readFileSync(
    locate('src/css/highlightjs-github/styles.css'),
    'utf8'
);

const marked = new Marked(
    markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

function toRecipient(to: string) {
    return {
        emailAddress: {
            address: to
        }
    };
}

function parseBody(body: string, type: BodyType, styles: string) {
    let content: string;
    let contentType: RestrictedBodyType;

    switch (type) {
        case 'markdown':
            content = purify.sanitize(
                `<style>${styles}</style><style>${highlightJsCss}</style>${marked.parse(
                    body
                )}`,
                {
                    FORCE_BODY: true
                }
            );
            contentType = 'html';
            break;
        case 'html':
        case 'text':
            contentType = type as RestrictedBodyType;
            content = body;
            break;
        default:
            contentType = 'text';
            content = body;
    }

    return {
        contentType,
        content
    };
}

function parseAttachments(
    body: string,
    type: RestrictedBodyType,
    originalBodyPath: string
) {
    if (type === 'text') return [];

    const $ = load(body);

    return $('[src], [href]')
        .map((_, element) => {
            const $element = $(element);
            const asset = String($element.attr('src') ?? $element.attr('href'));

            if (!asset || asset.startsWith('http') || asset.startsWith('#'))
                return null;

            const path = locate(`${dirname(originalBodyPath)}/${asset}`);

            const content = readFileSync(path);

            return {
                '@odata.type': '#microsoft.graph.fileAttachment',
                name: asset,
                contentType:
                    lookup(basename(path)) ?? 'application/octet-stream',
                contentBytes: content.toString('base64')
            };
        })
        .toArray()
        .filter(Boolean);
}

export default async function (options: EmailOptions) {
    const bodyData = parseBody(
        options.body,
        options.type,
        options.markdownStyles
    );

    const body = {
        message: {
            subject: options.subject,
            body: bodyData,
            toRecipients: options.to.map(toRecipient),
            ccRecipients: options.cc.map(toRecipient),
            bccRecipients: options.bcc.map(toRecipient),
            attachments: parseAttachments(
                bodyData.content,
                bodyData.contentType,
                options.originalBodyPath
            )
        }
    };

    await options.graph.unit('me/sendMail', {
        method: 'POST',
        body
    });
}
