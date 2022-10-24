import { VaultExtensionOptions } from '@giancarl021/cli-core-vault-extension/interfaces';

const baseData = {
    cache: {},
    credentials: {
        default: null,
        keys: []
    }
};

export default {
    baseData,
    dataPath: '~/.graph-mailer/vars.json'
} as VaultExtensionOptions;
