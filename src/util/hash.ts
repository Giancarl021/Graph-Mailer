import { createHash } from 'crypto';

export default function (str?: string) {
    if (!str) str = 'default';

    const hash = createHash('md5').update(str).digest('base64');

    return hash;
}
