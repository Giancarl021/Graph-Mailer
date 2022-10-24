import { BodyType, EmailOptions } from '../interfaces';

import { marked } from 'marked';
import * as DOMPurify from 'dompurify';

type RestrictedBodyType = Exclude<BodyType, 'markdown'>;

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
            content = DOMPurify.sanitize(
                `<style>${styles}</style>${marked(body)}`
            );
            contentType = 'html';
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
    await options.graph.unit('me/sendMail', {
        method: 'POST',
        body: {
            message: {
                subject: options.subject
            },
            body: parseBody(options.body, options.type, options.markdownStyles),
            toRecipients: options.to.map(toRecipient),
            ccRecipients: options.cc.map(toRecipient),
            bccRecipients: options.bcc.map(toRecipient)
        }
    });
}
