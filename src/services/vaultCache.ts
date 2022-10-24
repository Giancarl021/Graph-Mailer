import { CommandInternal } from '@giancarl021/cli-core/interfaces';
import { CacheService } from 'graph-interface/lib/interfaces';
import { Credentials } from '../interfaces';

import hash from '../util/hash';

interface Expirations {
    [key: string]: Date | null;
}

interface ExpirationsString {
    [key: string]: string;
}

export default function (
    internal: CommandInternal,
    credentials: Credentials
): CacheService {
    const credentialsHash = hash(
        `${credentials.auth.clientId}-${credentials.auth.clientSecret}-${credentials.auth.tenantId}::${credentials.isDelegated}`
    );

    const cacheData: ExpirationsString | null =
        internal.extensions.vault.getData(
            `cache.${credentialsHash}.expirations`
        ) ?? null;

    const expirations: Expirations = internal.helpers.valueOrDefault(
        cacheData &&
            Object.entries(cacheData).reduce((obj, [key, value]) => {
                obj[key] = value ? new Date(value) : null;
                return obj;
            }, {} as Expirations),
        {}
    );

    function Key(key: string, isExpiration = false) {
        return `cache.${credentialsHash}.${
            isExpiration ? 'expirations' : 'data'
        }.${key}`;
    }

    async function expire(key: string) {
        internal.extensions.vault.removeData(Key(key));
        internal.extensions.vault.removeData(Key(key, true));
        delete expirations[key];
    }

    async function has(key: string) {
        const now = new Date();
        if (expirations[key] === null) return true;
        if (!expirations[key]) return false;

        if (now > expirations[key]!) {
            await expire(key);
            return false;
        }

        return true;
    }

    async function get<T>(key: string) {
        if (!(await has(key)))
            throw new Error(`Item "${key}" not found in cache`);

        return internal.extensions.vault.getData(Key(key)) as T;
    }

    async function set<T>(key: string, value: T, expiration?: number) {
        const now = new Date();
        now.setSeconds(now.getSeconds() + (expiration ?? 0));

        expirations[key] = expiration ? now : null;

        internal.extensions.vault.setData(Key(key), value);
        internal.extensions.vault.setData(Key(key, true), expirations[key]);
    }

    return {
        get,
        set,
        has,
        expire
    };
}
