const createGraphInterface = require('graph-interface');
const createDesktopMiddleware = require('graph-interface-desktop-provider');

module.exports = async function () {
    const credentials = {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        tenantId: process.env.TENANT_ID
    };

    const graph = await createGraphInterface(credentials, {
        authenticationProvider: createDesktopMiddleware({ refreshTokenPath: '.gphauth', personal: process.env.PERSONAL })
    });

    return graph;
}