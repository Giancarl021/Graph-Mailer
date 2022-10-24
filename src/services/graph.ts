import GraphInterface from 'graph-interface';
import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';

import { Credentials } from 'graph-interface/lib/interfaces';
import { CommandInternal } from '@giancarl021/cli-core/interfaces';

import vaultCache from './vaultCache';

export default function (
    commandInternal: CommandInternal,
    credentials: Credentials,
    isDelegated: boolean,
    version?: string
) {
    const graph = GraphInterface(credentials, {
        authenticationProvider: isDelegated
            ? GraphInterfaceDesktopProvider({})
            : undefined,
        version,
        cacheService: vaultCache(commandInternal, {
            auth: credentials,
            isDelegated
        })
    });

    return graph;
}
