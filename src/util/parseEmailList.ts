import { CommandInternal } from '@giancarl021/cli-core/interfaces';

const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

function validator(email: string): boolean {
    return emailRegex.test(email);
}

export default function (
    list: string,
    parameterName: string = 'list'
): string[] {
    const items = list
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

    if (items.some((e) => !validator(e)))
        throw new Error(`Invalid ${parameterName} provided`);

    return items;
}
