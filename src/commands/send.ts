import axios, { AxiosError } from 'axios';
import { Command } from '@giancarl021/cli-core/interfaces';
import { existsSync as exists } from 'fs';
import { readFile } from 'fs/promises';
import locate from '@giancarl021/locate';

import parseEmailList from '../util/parseEmailList';
import constants from '../util/constants';
import sendEmail from '../services/email';
import Graph from '../services/graph';
import { BodyType, Credentials } from '../interfaces';

function isNullOrUndefined(data: any) {
    return data === null || data === undefined;
}

const command: Command = async function (args) {
    const [_to, subject, _body] = args;
    const _cc = (this.helpers.getFlag('cc', 'carbon-copy') ?? '') as string;
    const _bcc = (this.helpers.getFlag('bcc', 'blinded-carbon-copy') ??
        '') as string;

    const to = parseEmailList(_to, 'to');
    const cc = parseEmailList(_cc, this.helpers.whichFlag('cc', 'carbon-copy'));
    const bcc = parseEmailList(
        _bcc,
        this.helpers.whichFlag('bcc', 'blinded-carbon-copy')
    );

    const graphVersion = this.helpers.valueOrDefault(
        this.helpers.getFlag('graph-version'),
        'v1.0'
    );

    const _markdownStyles = this.helpers.valueOrDefault(
        this.helpers.getFlag('css', 'style'),
        `@${locate('src/css/splendor.min.css')}`
    );

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

    let body: string;
    let markdownStyles: string;

    if (_body.startsWith('@')) {
        const path = locate(_body.slice(1), true);

        if (!exists(path)) throw new Error(`Body file not found: ${path}`);

        body = await readFile(path, 'utf8');

        if (!type) {
            const ext = path.split('.').pop();

            const extension = ext && ext === 'md' ? 'markdown' : ext;

            if (extension && constants.types.includes(extension))
                type = extension;
            else type = 'text';
        }
    } else body = _body;

    if (_markdownStyles.startsWith('@')) {
        const path = locate(_markdownStyles.slice(1), true);

        if (!exists(path)) throw new Error(`CSS file not found: ${path}`);

        markdownStyles = await readFile(path, 'utf8');
    } else {
        try {
            const { data } = await axios.get(_markdownStyles, {
                responseType: 'text'
            });
            markdownStyles = data;
        } catch (_err) {
            const err = _err as AxiosError;

            throw new Error(
                `Failed to fetch CSS file: ${err.message} - ${err.code} ${
                    err.response?.data ?? 'No body'
                }`
            );
        }
    }

    const credentials: Credentials | null = JSON.parse(
        await this.extensions.vault.getSecret(constants.auth.credentialsKey)
    );

    if (!credentials)
        throw new Error(
            'No credentials found. Run the "auth login" command to authenticate'
        );

    const graph = Graph(
        this,
        credentials.auth,
        credentials.accountType,
        graphVersion
    );

    await sendEmail({
        graph,
        bcc,
        subject,
        body,
        cc,
        to,
        markdownStyles,
        type: type as BodyType
    });

    return 'E-mail sent';
};

export default command;
