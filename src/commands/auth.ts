import { Credentials } from '../interfaces';
import { Credentials as GraphCredentials } from 'graph-interface/lib/interfaces';
import { Commands } from '@giancarl021/cli-core/interfaces';
import constants from '../util/constants';

const commands: Commands = {
    async login() {
        const clientId = this.helpers.getFlag('client-id', 'c');
        const clientSecret = this.helpers.getFlag('client-secret', 's');
        const tenantId = this.helpers.getFlag('tenant-id', 't');

        if (!clientId) throw new Error('No client id provided');
        if (!clientSecret) throw new Error('No client secret provided');
        if (!tenantId) throw new Error('No tenant id provided');

        const isDelegated =
            this.helpers.hasFlag('delegated', 'd') ||
            !this.helpers.hasFlag('no-delegated', 'no-d');

        const overwrite = this.helpers.hasFlag('force', 'f');

        const credentials: Credentials = {
            auth: {
                clientId,
                clientSecret,
                tenantId
            } as GraphCredentials,
            isDelegated
        };

        const hasSecret = Boolean(await this.extensions.vault.getSecret(constants.auth.credentialsKey));

        if (!overwrite && hasSecret)
            throw new Error(
                'Credentials already exists, use "--force" to overwrite'
            );

        const credentialsString = JSON.stringify(credentials);

        await this.extensions.vault.setSecret(constants.auth.credentialsKey, credentialsString);

        return 'Credentials set, you will be prompted to login next time you run a authentication-only command';
    },

    async logout() {
        const hasSecret = Boolean(await this.extensions.vault.getSecret(constants.auth.credentialsKey));

        if (!hasSecret) throw new Error('No credentials found');

        await this.extensions.vault.removeSecret(constants.auth.credentialsKey);

        return 'Credentials removed';
    }
};

export default commands;
