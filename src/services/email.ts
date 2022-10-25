import { BodyType, EmailOptions } from '../interfaces';

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

type RestrictedBodyType = Exclude<BodyType, 'markdown'>;

const window = new JSDOM('').window as unknown as Window;
const purify = DOMPurify(window);

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
                `<style>${styles}</style>${marked(body)}`,
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

export default async function (options: EmailOptions) {
    const body = {
        message: {
            subject: options.subject,
            body: parseBody(options.body, options.type, options.markdownStyles),
            toRecipients: options.to.map(toRecipient),
            ccRecipients: options.cc.map(toRecipient),
            bccRecipients: options.bcc.map(toRecipient)
        }
    };

    await options.graph.unit('me/sendMail', {
        method: 'POST',
        body
    });
}
