import GraphInterface from 'graph-interface';
import GraphInterfaceDesktopProvider from 'graph-interface-desktop-provider';

import { Credentials } from 'graph-interface/lib/interfaces';
import { CommandInternal } from '@giancarl021/cli-core/interfaces';

import vaultCache from './vaultCache';
import AccountType from 'graph-interface-desktop-provider/lib/src/interfaces/options/account-type';

export default function (
    commandInternal: CommandInternal,
    credentials: Credentials,
    accountType: AccountType,
    version?: string
) {
    const graph = GraphInterface(credentials, {
        authenticationProvider: GraphInterfaceDesktopProvider({ accountType }),
        version,
        cacheService: vaultCache(commandInternal, {
            auth: credentials,
            accountType
        })
    });

    return graph;
}
