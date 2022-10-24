import { Command } from '@giancarl021/cli-core/interfaces';
import { existsSync as exists } from 'fs';
import { readFile } from 'fs/promises';
import locate from '@giancarl021/locate';

import parseEmailList from '../util/parseEmailList';
import constants from '../util/constants';

function isNullOrUndefined(data: any) {
    return data === null || data === undefined;
}

const command: Command = async function (args) {
    const [_to, subject, _body] = args;

    const to = parseEmailList(_to, 'to');
    let type = this.helpers.getFlag('type', 't') as string | null;
    type = type ? type.toLowerCase() : null;

    if (!to.length) throw new Error('No recipients provided');
    if (type && !constants.types.includes(type))
        throw new Error(
            `Invalid body type provided. Allowed types are: ${constants.types.join(
                ', '
            )}`
        );
    if (isNullOrUndefined(subject)) throw new Error('No subject provided');
    if (isNullOrUndefined(_body)) throw new Error('No body provided');

    let body;

    if (_body.startsWith('@')) {
        const path = locate(_body.slice(1), true);

        if (!exists(path)) throw new Error(`File not found: ${path}`);

        body = await readFile(path, 'utf8');
        if (!type) {
        }
    } else body = _body;

    return '';
};

export default command;
