#!/usr/bin/env node

import CliCore from '@giancarl021/cli-core';
import { HelpDescriptor } from '@giancarl021/cli-core/interfaces';
import { Behavior } from '@giancarl021/cli-core/interfaces';
import CliCoreVaultExtension from '@giancarl021/cli-core-vault-extension';

import vaultExtensionOptions from './src/util/vaultExtensionOptions';
import * as commands from './src/commands';
import help from './src/util/help.json';

const APP_NAME = 'mailer';
const DEBUG_MODE =
    String(process.env.GRAPH_MAILER_DEBUG).toLowerCase() === 'true';

async function main() {
    const behavior: Behavior = {};
    const _help: any = help;
    delete _help['$schema'];

    if (DEBUG_MODE) {
        behavior.exitOnError = false;
        behavior.returnResult = true;
    }

    const runner = CliCore(APP_NAME, {
        appDescription: 'Microsoft Graph Mailing CLI tool',
        args: {
            flags: {
                helpFlags: ['?', 'h', 'help']
            }
        },
        behavior,
        commands,
        help: _help as HelpDescriptor,
        extensions: [CliCoreVaultExtension(vaultExtensionOptions)]
    });

    return await runner.run();
}

const commandPromise = main();

if (DEBUG_MODE) {
    commandPromise.then(console.log).catch(console.error);
}
