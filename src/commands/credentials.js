const { question, keyInYN } = require('readline-sync');
const createSecureJsonInterface = require('../util/sjson');
const createHash = require('../util/hash');

let file;

const operations = {
    set(_, flags) {

        if(!(flags.hasOwnProperty('f') || flags.hasOwnProperty('force')) && file.exists()) {
            const overwrite = keyInYN('Do you want to overwrite the current credentials?');
            if(!overwrite) return 'Aborted by user';
        }

        let tenantId = flags['tenant-id'] || flags.t;
        let clientId = flags['client-id'] || flags.c;
        let clientSecret = flags['client-secret'] || flags.s;
        const _personal = multipleFlags(flags, 'personal', 'p');
        let personal = _personal ? true : (_personal === false ? false : null);

        if(!tenantId) {
            tenantId = question('Insert the Tenant ID: ');
        }
        if(!clientId) {
            clientId = question('Insert the Client ID: ');
        }
        if(!clientSecret) {
            clientSecret = question('Insert the Client Secret: ');
        }

        if(personal === null) {
            personal = keyInYN('This credentials are for personal accounts? ');
        }

        file.save({
            clientId,
            clientSecret,
            tenantId,
            personal
        });

        return 'Credentials saved';
    },

    get() {
        if(!file.exists()) {
            return 'Credentials not configured';
        }

        const data = file.load();

        return `Tenant ID: ${data.tenantId}\n` +
            `Client ID: ${data.clientId}\n` +
            `Client Secret: ${data.clientSecret}\n` +
            `Account Type: ${data.personal ? 'Personal': 'Organizational'}\n`;
    },

    remove(_, flags) {
        if(!file.exists()) {
            return 'Credentials not configured';
        }

        let rm;
        if(flags.hasOwnProperty('f') || flags.hasOwnProperty('force')) {
            rm = true;
        } else {
            rm = keyInYN('Are you sure you want to remove the credentials?');
        }

        if(!rm) {
            return 'Operation aborted by user';
        }

        file.remove();

        return 'Credentials removed';
    }
};

module.exports = function (args, flags) {
    const index = args.shift();

    const operation = operations[index];
    if (!operation) {
        return `Operation "${index || ''}" does not exists in the "credentials" command`;
    }

    file = createSecureJsonInterface('data/credentials', createHash(process.env.USERNAME || process.env.USER), true);

    return operation(args, flags);
}

function multipleFlags(flags, ...names) {
    for(const name of names) {
        if(flags.hasOwnProperty(name)) return flags[name];
    }

    return null;
}