const createGraphInterface = require('graph-interface');
const createDesktopMiddleware = require('graph-interface-desktop-provider');
const createHash = require('./hash');
const createSecureJsonInterface = require('./sjson');

module.exports = async function () {
    const file = createSecureJsonInterface('data/credentials', createHash(process.env.USERNAME || process.env.USER), true);

    if(!file.exists()) {
        throw new Error('Credentials file does not exist');
    }

    const credentials = file.load();

    const graph = await createGraphInterface(credentials, {
        authenticationProvider: createDesktopMiddleware({ refreshTokenPath: '.gphauth', personal: credentials.personal })
    });

    return graph;
}